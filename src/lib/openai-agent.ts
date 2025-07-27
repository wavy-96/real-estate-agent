import { openai } from '@ai-sdk/openai'
import { generateObject, generateText } from 'ai'
import { z } from 'zod'

// Property search tool schema
const PropertySearchSchema = z.object({
  location: z.string().describe('The location to search for properties'),
  budget_min: z.number().optional().describe('Minimum budget in USD'),
  budget_max: z.number().optional().describe('Maximum budget in USD'),
  bedrooms: z.number().optional().describe('Number of bedrooms required'),
  bathrooms: z.number().optional().describe('Number of bathrooms required'),
  property_type: z.enum(['house', 'apartment', 'condo', 'townhouse', 'any']).optional().describe('Type of property'),
  amenities: z.array(z.string()).optional().describe('Required amenities'),
})

// Property analysis tool schema
const PropertyAnalysisSchema = z.object({
  property_id: z.string().describe('The property ID to analyze'),
  analysis_type: z.enum(['market_value', 'investment_potential', 'neighborhood_info', 'comprehensive']).describe('Type of analysis to perform'),
})

// Property comparison tool schema
const PropertyComparisonSchema = z.object({
  property_ids: z.array(z.string()).describe('Array of property IDs to compare'),
  comparison_criteria: z.array(z.string()).describe('Criteria to compare (price, location, amenities, etc.)'),
})

// Market analysis tool schema
const MarketAnalysisSchema = z.object({
  location: z.string().describe('Location for market analysis'),
  analysis_type: z.enum(['price_trends', 'inventory_levels', 'days_on_market', 'comprehensive']).describe('Type of market analysis'),
})

export class RealEstateAgent {
  private brokerData: any
  private clientData: any

  constructor(brokerData: any, clientData: any) {
    this.brokerData = brokerData
    this.clientData = clientData
  }

  // Tool: Search for properties
  async searchProperties(params: z.infer<typeof PropertySearchSchema>) {
    try {
      console.log('Search properties called with params:', params)
      
      // Use client data as fallback if params are missing
      const searchParams = {
        location: params.location || this.clientData?.location || 'Downtown',
        budget_min: params.budget_min || this.clientData?.budget_min || 300000,
        budget_max: params.budget_max || this.clientData?.budget_max || 800000,
        bedrooms: params.bedrooms || this.clientData?.bedrooms || 2,
        bathrooms: params.bathrooms || this.clientData?.bathrooms || 2,
        property_type: params.property_type || 'any',
        amenities: params.amenities || this.clientData?.amenities || [],
        rent_or_buy: this.clientData?.rent_or_buy || 'buy'
      }
      
      console.log('Using search params:', searchParams)
      
      // In a real app, this would query your property database
      // For demo, we'll return mock data based on the search criteria
      const mockProperties = this.generateMockProperties(searchParams)
      
      return {
        success: true,
        properties: mockProperties,
        total: mockProperties.length,
        search_criteria: searchParams
      }
    } catch (error) {
      console.error('Search properties error:', error)
      return {
        success: false,
        error: 'Failed to search properties'
      }
    }
  }

  // Tool: Analyze a specific property
  async analyzeProperty(params: z.infer<typeof PropertyAnalysisSchema>) {
    try {
      const analysis = await this.generatePropertyAnalysis(params)
      
      return {
        success: true,
        property_id: params.property_id,
        analysis: analysis,
        analysis_type: params.analysis_type
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to analyze property'
      }
    }
  }

  // Tool: Compare multiple properties
  async compareProperties(params: z.infer<typeof PropertyComparisonSchema>) {
    try {
      console.log('Comparing properties with params:', params)
      
      // Extract property IDs from the message if not provided in params
      let propertyIds = params.property_ids
      if (!propertyIds || propertyIds.length === 0) {
        // Try to extract from the message context - we'll need to pass this differently
        console.log('No property IDs provided in params')
      }
      
      if (!propertyIds || propertyIds.length < 2) {
        return {
          success: false,
          error: 'Need at least 2 property IDs to compare'
        }
      }
      
      const comparison = await this.generatePropertyComparison({ property_ids: propertyIds })
      
      return {
        success: true,
        comparison: comparison,
        property_ids: propertyIds,
        criteria: params.comparison_criteria || 'price,features,value'
      }
    } catch (error) {
      console.error('Compare properties error:', error)
      return {
        success: false,
        error: 'Failed to compare properties'
      }
    }
  }

  // Tool: Market analysis
  async analyzeMarket(params: z.infer<typeof MarketAnalysisSchema>) {
    try {
      const marketData = await this.generateMarketAnalysis(params)
      
      return {
        success: true,
        location: params.location,
        market_analysis: marketData,
        analysis_type: params.analysis_type
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to analyze market'
      }
    }
  }

  // Tool: Setup property showing
  async setupShowing(params: any) {
    try {
      const showingData = await this.generateShowingSchedule(params)
      
      return {
        success: true,
        showing: showingData,
        client_name: this.clientData?.name,
        broker_name: this.brokerData?.name
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to setup showing'
      }
    }
  }

  // Main chat function
  async chat(message: string, selectedProperties?: string[]) {
    try {
      console.log('Chat request:', { message, brokerData: this.brokerData, clientData: this.clientData, selectedProperties })
      
      const result = await generateObject({
        model: openai('gpt-4o'),
        schema: z.object({
          tool: z.enum(['search_properties', 'analyze_property', 'compare_properties', 'analyze_market', 'setup_showing', 'general_help']),
          parameters: z.any(),
          response: z.string().describe('A helpful response to the user')
        }),
        prompt: `You are ${this.brokerData?.name || 'a professional real estate agent'} with ${this.brokerData?.years_experience || 5} years of experience specializing in ${this.brokerData?.service_area || 'residential properties'}.

${this.clientData ? `Your client ${this.clientData.name} is looking for:
- Type: ${this.clientData.rent_or_buy}
- Budget: $${this.clientData.budget_min.toLocaleString()} - $${this.clientData.budget_max.toLocaleString()}
- Bedrooms: ${this.clientData.bedrooms}
- Bathrooms: ${this.clientData.bathrooms}
- Location: ${this.clientData.location}
- Amenities: ${this.clientData.amenities?.join(', ')}

Use this context to provide personalized recommendations and responses.` : 'This is a new client without specific preferences yet.'}

User message: ${message}

Based on the user's message, determine which tool to use and provide a helpful response. Available tools:
1. search_properties - ONLY when user explicitly wants to find/search for new properties
2. analyze_property - When user asks about a specific property address or ID
3. compare_properties - When user wants to compare multiple properties
4. analyze_market - When user asks about market trends, conditions, or analysis
5. setup_showing - When user wants to schedule a showing, book a viewing, or arrange a property visit
6. general_help - For general questions, greetings, or when no specific tool is needed

IMPORTANT: Only use search_properties when the user explicitly asks to find, search, or look for properties. For general questions, greetings, or other requests, use general_help.

Always be professional, knowledgeable, and helpful. Use the client's preferences when available. Personalize responses based on their specific needs and preferences.`
      })

      console.log('OpenAI result:', result)
      
      // Execute the appropriate tool
      let toolResult = null
      switch (result.object.tool) {
        case 'search_properties':
          toolResult = await this.searchProperties(result.object.parameters)
          break
        case 'analyze_property':
          toolResult = await this.analyzeProperty(result.object.parameters)
          break
        case 'compare_properties':
          // Use selected properties if available, otherwise use parameters
          const compareParams = {
            ...result.object.parameters,
            property_ids: selectedProperties && selectedProperties.length > 0 
              ? selectedProperties 
              : result.object.parameters.property_ids
          }
          toolResult = await this.compareProperties(compareParams)
          break
        case 'analyze_market':
          toolResult = await this.analyzeMarket(result.object.parameters)
          break
        case 'setup_showing':
          toolResult = await this.setupShowing(result.object.parameters)
          break
      }

      console.log('Tool result:', toolResult)

      return {
        response: result.object.response,
        tool_used: result.object.tool,
        tool_result: toolResult
      }
    } catch (error) {
      console.error('Chat error:', error)
      return {
        response: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        tool_used: 'general_help',
        tool_result: null
      }
    }
  }

  // Helper methods for generating mock data
  private generateMockProperties(searchParams: any) {
    console.log('Generating mock properties with params:', searchParams)
    
    const properties = []
    const basePrice = searchParams.budget_min || 300000
    const maxPrice = searchParams.budget_max || 800000
    const targetBedrooms = searchParams.bedrooms || 2
    const targetBathrooms = searchParams.bathrooms || 2
    const location = searchParams.location || 'Downtown'
    
    for (let i = 1; i <= 5; i++) {
      // Generate price within budget range
      const price = Math.floor(Math.random() * (maxPrice - basePrice) + basePrice)
      
      // Generate properties that match the search criteria
      const bedrooms = targetBedrooms + Math.floor(Math.random() * 2) - 1 // ±1 bedroom variation
      const bathrooms = targetBathrooms + Math.floor(Math.random() * 2) - 1 // ±1 bathroom variation
      
      // Ensure minimum values
      const finalBedrooms = Math.max(1, bedrooms)
      const finalBathrooms = Math.max(1, bathrooms)
      
      const streetNames = ['Oak', 'Maple', 'Pine', 'Cedar', 'Elm', 'Birch', 'Willow', 'Cherry']
      const streetName = streetNames[Math.floor(Math.random() * streetNames.length)]
      const streetNumber = Math.floor(Math.random() * 9999) + 1
      
      properties.push({
        id: `prop_${i}`,
        address: `${streetNumber} ${streetName} St, ${location}`,
        price: price,
        bedrooms: finalBedrooms,
        bathrooms: finalBathrooms,
        sqft: Math.floor(Math.random() * 2000) + 800,
        property_type: searchParams.property_type || ['house', 'apartment', 'condo'][Math.floor(Math.random() * 3)],
        amenities: searchParams.amenities?.slice(0, 3) || ['Parking', 'Gym', 'Pool'].slice(0, Math.floor(Math.random() * 3) + 1),
        images: [`/api/property-image/${i}`],
        description: `Beautiful ${searchParams.property_type || 'property'} in ${location} with ${finalBedrooms} bedrooms and ${finalBathrooms} bathrooms. Perfect for ${searchParams.rent_or_buy === 'buy' ? 'buying' : 'renting'}.`
      })
    }
    
    console.log('Generated properties:', properties)
    return properties
  }

  private async generatePropertyAnalysis(params: any) {
    // Mock property analysis
    return {
      market_value: Math.floor(Math.random() * 200000) + 300000,
      estimated_rent: Math.floor(Math.random() * 3000) + 1500,
      property_taxes: Math.floor(Math.random() * 5000) + 2000,
      neighborhood_rating: (Math.random() * 2 + 3).toFixed(1),
      investment_score: Math.floor(Math.random() * 40) + 60,
      days_on_market: Math.floor(Math.random() * 30) + 5,
      price_per_sqft: Math.floor(Math.random() * 200) + 150
    }
  }

  private async generatePropertyComparison(params: any) {
    // Generate mock property data for comparison
    const propertyData = params.property_ids.map((id: string) => {
      const addresses = [
        '9045 Oak St, Downtown',
        '1800 Elm St, Downtown', 
        '2081 Maple St, Downtown',
        '5879 Oak St, Downtown',
        '842 Elm St, Downtown',
        '6215 Pine St, Downtown',
        '1271 Pine St, Downtown',
        '40 Cedar St, Downtown',
        '1197 Maple St, Downtown',
        '4178 Maple St, Downtown'
      ]
      
      // Use the property ID to get a consistent address
      const propIndex = parseInt(id.replace('prop_', '')) - 1
      const address = addresses[propIndex] || `${Math.floor(Math.random() * 9999)} ${['Oak', 'Maple', 'Pine', 'Cedar', 'Elm'][Math.floor(Math.random() * 5)]} St, Downtown`
      
      return {
        id: id,
        address: address,
        price: Math.floor(Math.random() * 200000) + 300000,
        price_per_sqft: Math.floor(Math.random() * 200) + 150,
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        sqft: Math.floor(Math.random() * 2000) + 800
      }
    })
    
    return {
      price_comparison: propertyData.map((prop: any) => ({
        property_id: prop.id,
        property_address: prop.address,
        price: prop.price,
        price_per_sqft: prop.price_per_sqft
      })),
      feature_comparison: propertyData.map((prop: any) => ({
        property_id: prop.id,
        property_address: prop.address,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        sqft: prop.sqft
      })),
      recommendation: `Based on your preferences, I recommend ${propertyData[0].address} as it offers the best value for your budget.`
    }
  }

  private async generateMarketAnalysis(params: any) {
    // Mock market analysis
    return {
      average_price: Math.floor(Math.random() * 200000) + 400000,
      price_trend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
      days_on_market: Math.floor(Math.random() * 30) + 15,
      inventory_level: Math.random() > 0.5 ? 'low' : 'high',
      market_activity: Math.random() > 0.5 ? 'active' : 'slow',
      forecast: `The ${params.location} market is expected to remain ${Math.random() > 0.5 ? 'strong' : 'stable'} in the coming months.`
    }
  }

  private async generateShowingSchedule(params: any) {
    // Mock showing schedule
    const availableTimes = [
      'Tomorrow at 2:00 PM',
      'Tomorrow at 4:00 PM', 
      'Wednesday at 10:00 AM',
      'Wednesday at 3:00 PM',
      'Thursday at 1:00 PM',
      'Friday at 11:00 AM'
    ]
    
    return {
      available_slots: availableTimes,
      preferred_time: availableTimes[Math.floor(Math.random() * availableTimes.length)],
      duration: '45 minutes',
      meeting_location: 'Property location',
      contact_info: this.clientData?.phone || this.clientData?.email,
      notes: 'Please bring photo ID and be prepared to discuss financing options.'
    }
  }
} 