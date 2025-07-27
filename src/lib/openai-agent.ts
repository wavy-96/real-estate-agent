import { openai } from '@ai-sdk/openai'
import { generateObject, generateText } from 'ai'
import { z } from 'zod'
import { performanceMonitor } from './performance-monitor'

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

// Cache for storing responses to avoid redundant API calls
const responseCache = new Map<string, any>()

export class RealEstateAgent {
  private brokerData: any
  private clientData: any
  private conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []
  private lastSearchResults: any[] = [] // Store results of the last search

  constructor(brokerData: any, clientData: any) {
    this.brokerData = brokerData
    this.clientData = clientData
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = []
  }

  clearSearchResults() {
    this.lastSearchResults = []
  }

  // Add message to conversation history
  private addToHistory(role: 'user' | 'assistant', content: string) {
    this.conversationHistory.push({ role, content })
    // Keep only the last 10 messages to prevent context overflow
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10)
    }
  }

  // Generate cache key for responses
  private generateCacheKey(message: string, selectedProperties?: string[]): string {
    const context = {
      message: message.toLowerCase().trim(),
      brokerId: this.brokerData?.id,
      clientId: this.clientData?.id,
      selectedProperties: selectedProperties?.sort() || []
    }
    return JSON.stringify(context)
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
      this.lastSearchResults = mockProperties // Store for comparison
      
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

  // Main chat function with improved performance
  async chat(message: string, selectedProperties?: string[]) {
    const startTime = Date.now()
    
    try {
      console.log('Chat request:', { message, brokerData: this.brokerData, clientData: this.clientData, selectedProperties })
      
      // Check cache first
      const cacheKey = this.generateCacheKey(message, selectedProperties)
      if (responseCache.has(cacheKey)) {
        console.log('Returning cached response')
        performanceMonitor.trackRequest(startTime, Date.now(), true)
        return responseCache.get(cacheKey)
      }

      // Add user message to history
      this.addToHistory('user', message)
      
      // Create optimized system prompt
      const systemPrompt = this.createSystemPrompt()
      
      const result = await generateObject({
        model: openai('gpt-4o'),
        schema: z.object({
          tool: z.enum(['search_properties', 'analyze_property', 'compare_properties', 'analyze_market', 'setup_showing', 'general_help']),
          parameters: z.any(),
          response: z.string().describe('A helpful, concise response to the user')
        }),
        messages: [
          { role: 'system', content: systemPrompt },
          ...this.conversationHistory.slice(-6), // Include recent conversation context
          { role: 'user', content: message }
        ],
        maxTokens: 1000, // Limit response length for better performance
        temperature: 0.7, // Slightly more creative but still focused
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

      const response = {
        response: result.object.response,
        tool_used: result.object.tool,
        tool_result: toolResult
      }

      // Cache the response for 5 minutes
      responseCache.set(cacheKey, response)
      setTimeout(() => responseCache.delete(cacheKey), 5 * 60 * 1000)

      // Add assistant response to history
      this.addToHistory('assistant', result.object.response)

      // Track performance
      performanceMonitor.trackRequest(startTime, Date.now(), false)

      return response
    } catch (error) {
      console.error('Chat error:', error)
      performanceMonitor.trackError()
      return {
        response: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        tool_used: 'general_help',
        tool_result: null
      }
    }
  }

  // Create optimized system prompt
  private createSystemPrompt(): string {
    const brokerInfo = this.brokerData ? 
      `You are ${this.brokerData.name}, a professional real estate agent with ${this.brokerData.years_of_experience} years of experience specializing in ${this.brokerData.area_of_service}.` :
      'You are a professional real estate agent with extensive experience in residential properties.'

    const clientInfo = this.clientData ? 
      `\n\nCLIENT PREFERENCES:
- Name: ${this.clientData.name}
- Looking to: ${this.clientData.rent_or_buy}
- Budget: $${this.clientData.budget_min.toLocaleString()} - $${this.clientData.budget_max.toLocaleString()}
- Property: ${this.clientData.bedrooms} bedrooms, ${this.clientData.bathrooms} bathrooms
- Location: ${this.clientData.location}
- Amenities: ${this.clientData.amenities?.join(', ') || 'None specified'}

Use these preferences to provide personalized recommendations.` : 
      '\n\nThis is a new client without specific preferences yet.'

    return `${brokerInfo}${clientInfo}

AVAILABLE TOOLS:
1. search_properties - Use ONLY when user explicitly asks to find/search for properties
2. analyze_property - When user asks about a specific property address or ID
3. compare_properties - When user wants to compare multiple properties
4. analyze_market - When user asks about market trends, conditions, or analysis
5. setup_showing - When user wants to schedule a showing, book a viewing, or arrange a property visit
6. general_help - For general questions, greetings, or when no specific tool is needed

INSTRUCTIONS:
- Be professional, knowledgeable, and helpful
- Keep responses concise and actionable
- Personalize responses based on client preferences when available
- Only use search_properties when explicitly requested
- For general questions or greetings, use general_help
- Always provide value and next steps when possible`
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
    // Get the actual property data from the last search results
    const lastSearchResults = this.lastSearchResults || []
    
    console.log('Available properties for comparison:', lastSearchResults.map(p => ({ id: p.id, address: p.address })))
    console.log('Requested property IDs:', params.property_ids)
    
    // Filter properties based on the requested IDs
    const propertyData = params.property_ids.map((id: string) => {
      // Find the property in the last search results
      const foundProperty = lastSearchResults.find((prop: any) => prop.id === id)
      
      if (foundProperty) {
        console.log(`Found property ${id}:`, foundProperty.address)
        return {
          id: foundProperty.id,
          address: foundProperty.address,
          price: foundProperty.price,
          price_per_sqft: Math.floor(foundProperty.price / foundProperty.sqft),
          bedrooms: foundProperty.bedrooms,
          bathrooms: foundProperty.bathrooms,
          sqft: foundProperty.sqft,
          amenities: foundProperty.amenities,
          property_type: foundProperty.property_type
        }
      } else {
        // Fallback if property not found in search results
        console.warn(`Property ${id} not found in search results, using mock data`)
        return {
          id: id,
          address: `Property ${id} (Not found in recent search)`,
          price: Math.floor(Math.random() * 200000) + 300000,
          price_per_sqft: Math.floor(Math.random() * 200) + 150,
          bedrooms: Math.floor(Math.random() * 4) + 1,
          bathrooms: Math.floor(Math.random() * 3) + 1,
          sqft: Math.floor(Math.random() * 2000) + 800,
          amenities: ['Parking', 'Gym'],
          property_type: 'any'
        }
      }
    })
    
    // Calculate price comparison
    const priceComparison = propertyData.map((prop: any) => ({
      property_id: prop.id,
      property_address: prop.address,
      price: prop.price,
      price_per_sqft: prop.price_per_sqft,
      price_formatted: `$${prop.price.toLocaleString()}`
    }))
    
    // Calculate feature comparison
    const featureComparison = propertyData.map((prop: any) => ({
      property_id: prop.id,
      property_address: prop.address,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      sqft: prop.sqft,
      amenities: prop.amenities,
      property_type: prop.property_type
    }))
    
    // Generate recommendation based on client preferences
    let recommendation = ''
    if (this.clientData) {
      const { budget_min, budget_max, bedrooms, bathrooms, location } = this.clientData
      
      // Find the best property based on client preferences
      const bestProperty = propertyData.reduce((best: any, current: any) => {
        let bestScore = 0
        let currentScore = 0
        
        // Score based on budget fit
        if (current.price >= budget_min && current.price <= budget_max) {
          currentScore += 3
        }
        
        // Score based on bedroom match
        if (current.bedrooms >= bedrooms) {
          currentScore += 2
        }
        
        // Score based on bathroom match
        if (current.bathrooms >= bathrooms) {
          currentScore += 1
        }
        
        // Score based on price (lower is better within budget)
        if (current.price <= budget_max) {
          currentScore += (budget_max - current.price) / 10000
        }
        
        if (currentScore > bestScore) {
          return current
        }
        return best
      })
      
      recommendation = `Based on your preferences (${bedrooms} bedrooms, ${bathrooms} bathrooms, budget $${budget_min.toLocaleString()}-$${budget_max.toLocaleString()}), I recommend ${bestProperty.address} as it offers the best value for your needs.`
    } else {
      recommendation = `Based on the comparison, I recommend ${propertyData[0].address} as it offers the best overall value.`
    }
    
    return {
      price_comparison: priceComparison,
      feature_comparison: featureComparison,
      recommendation: recommendation
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