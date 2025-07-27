import { NextRequest, NextResponse } from 'next/server'
import { RealEstateAgent } from '@/lib/openai-agent'

export async function POST(request: NextRequest) {
  try {
    const { message, brokerData, clientData, selectedProperties } = await request.json()

    console.log('Chat API request:', { message, brokerData, clientData, selectedProperties })

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Create the real estate agent instance
    const agent = new RealEstateAgent(brokerData, clientData)

    // Get response from the agent with selected properties context
    const result = await agent.chat(message, selectedProperties)

    console.log('Chat API response:', result)

    return NextResponse.json({
      success: true,
      response: result.response,
      tool_used: result.tool_used,
      tool_result: result.tool_result
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        response: "I'm sorry, I'm having trouble processing your request. Please try again."
      },
      { status: 500 }
    )
  }
} 