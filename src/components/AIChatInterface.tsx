'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ArrowLeft, Home, Search, BarChart3, GitCompare, MessageSquare, Activity, MessageCircle } from 'lucide-react'
import PerformanceDashboard from './PerformanceDashboard'

interface Message {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: Date
  toolResult?: any
}

interface AIChatInterfaceProps {
  brokerData: any
  clientData: any
  onBack: () => void
  isNewUser?: boolean
}

export default function AIChatInterface({ brokerData, clientData, onBack, isNewUser = false }: AIChatInterfaceProps) {
  // Helper function to properly capitalize name
  const formatName = (name: string) => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! I'm ${formatName(brokerData.name)}, your real estate agent. I have ${brokerData.years_experience} years of experience in ${brokerData.service_area}. How can I help you today?`,
      sender: 'agent',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [loadingStage, setLoadingStage] = useState('')
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-trigger property search for new users
  useEffect(() => {
    if (isNewUser && clientData) {
      // Wait a moment for the initial greeting to appear
      const timer = setTimeout(() => {
        const searchMessage = `Please search for properties in ${clientData.location} with a budget between $${clientData.budget_min.toLocaleString()} and $${clientData.budget_max.toLocaleString()}. I need ${clientData.bedrooms} bedrooms and ${clientData.bathrooms} bathrooms. I'm interested in ${clientData.rent_or_buy === 'buy' ? 'buying' : 'renting'}.`
        setInputValue(searchMessage)
        // Use a separate function to avoid dependency issues
        const autoSendMessage = async () => {
          if (!searchMessage.trim() || isLoading) return

          const userMessage: Message = {
            id: Date.now().toString(),
            text: searchMessage,
            sender: 'user',
            timestamp: new Date()
          }

          setMessages(prev => [...prev, userMessage])
          setInputValue('')
          setIsLoading(true)
          setLoadingMessage('Searching properties...')
          setLoadingStage('analyzing')
          
          try {
            setTimeout(() => setLoadingStage('searching'), 500)
            setTimeout(() => setLoadingStage('processing'), 1500)
            
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: searchMessage,
                brokerData,
                clientData,
                selectedProperties: []
              }),
            })

            const data = await response.json()
            
            const agentMessage: Message = {
              id: (Date.now() + 1).toString(),
              text: data.response,
              sender: 'agent',
              timestamp: new Date(),
              toolResult: data.tool_result
            }

            setMessages(prev => [...prev, agentMessage])
          } catch (error) {
            console.error('Auto-search error:', error)
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              text: 'I apologize, but I\'m having trouble searching properties right now. Please try again.',
              sender: 'agent',
              timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
          } finally {
            setIsLoading(false)
            setLoadingMessage('')
            setLoadingStage('')
          }
        }
        
        autoSendMessage()
      }, 2000) // Wait 2 seconds after component mounts

      return () => clearTimeout(timer)
    }
  }, [isNewUser, clientData, brokerData])

  // Property interaction handlers
  const handlePropertyClick = (property: any) => {
    // Toggle selection
    setSelectedProperties(prev => 
      prev.includes(property.id) 
        ? prev.filter(id => id !== property.id)
        : [...prev, property.id]
    )
  }

  const handlePropertyDetails = (property: any) => {
    // Ask AI for detailed analysis of this property
    const message = `Tell me more about the ${property.address} property`
    setInputValue(message)
    handleSendMessage()
  }

  const handleCompareProperty = (property: any) => {
    // Toggle property in comparison list
    setSelectedProperties(prev => 
      prev.includes(property.id) 
        ? prev.filter(id => id !== property.id)
        : [...prev, property.id]
    )
  }

  const handleCompareSelected = () => {
    if (selectedProperties.length < 2) {
      alert('Please select at least 2 properties to compare')
      return
    }
    
    // Ask AI to compare selected properties with specific IDs
    const message = `Compare the properties with IDs: ${selectedProperties.join(', ')}`
    setInputValue(message)
    handleSendMessage()
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setLoadingStage('analyzing')
    
    // Set appropriate loading message based on user input
    const lowerMessage = inputValue.toLowerCase()
    if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('property')) {
      setLoadingMessage('Searching properties...')
    } else if (lowerMessage.includes('market') || lowerMessage.includes('trend')) {
      setLoadingMessage('Analyzing market data...')
    } else if (lowerMessage.includes('compare')) {
      setLoadingMessage('Comparing properties...')
    } else {
      setLoadingMessage('Thinking...')
    }

    try {
      // Simulate loading stages
      setTimeout(() => setLoadingStage('searching'), 500)
      setTimeout(() => setLoadingStage('processing'), 1500)
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          brokerData,
          clientData,
          selectedProperties
        }),
      })

      const data = await response.json()
      
      console.log('Chat API response data:', data)

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'agent',
        timestamp: new Date(),
        toolResult: data.tool_result
      }

      setMessages(prev => [...prev, agentMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
        sender: 'agent',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setLoadingMessage('')
      setLoadingStage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    {
      icon: <Search className="w-5 h-5" />,
      text: 'Find Properties',
      action: () => setInputValue('I want to find properties in my area')
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      text: 'Market Analysis',
      action: () => setInputValue('Can you analyze the market in my area?')
    },
    {
      icon: <GitCompare className="w-5 h-5" />,
      text: 'Compare Properties',
      action: () => setInputValue('I want to compare some properties')
    },
    {
      icon: <Home className="w-5 h-5" />,
      text: 'Property Details',
      action: () => setInputValue('Tell me more about a specific property')
    }
  ]

  const formatToolResult = (toolResult: any) => {
    if (!toolResult) return null

    console.log('Formatting tool result:', toolResult)

    // Check if toolResult has a success property (meaning it's a tool result)
    if (toolResult.success !== undefined) {
      // This is a tool result object
      if (toolResult.properties) {
        return (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Found Properties</h4>
            <div className="space-y-3">
              <div className="text-sm text-blue-700 mb-2">
                Found {toolResult.properties?.length || 0} properties matching your criteria
              </div>
              {toolResult.properties?.map((prop: any) => {
                const isSelected = selectedProperties.includes(prop.id)
                return (
                  <motion.div 
                    key={prop.id} 
                    className={`bg-white p-3 rounded border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'hover:shadow-md hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handlePropertyClick(prop)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium">{prop.address}</h5>
                          {isSelected && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{prop.description}</p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span>{prop.bedrooms} beds</span>
                          <span>{prop.bathrooms} baths</span>
                          <span>{prop.sqft} sqft</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">${prop.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{prop.property_type}</div>
                      </div>
                    </div>
                    {/* Action buttons */}
                    <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePropertyDetails(prop)
                        }}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCompareProperty(prop)
                        }}
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                      >
                        {isSelected ? 'Remove from Compare' : 'Add to Compare'}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
              {/* Compare button if properties are selected */}
              {selectedProperties.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="flex gap-2">
                    <button
                      onClick={handleCompareSelected}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Compare {selectedProperties.length} Selected Properties
                    </button>
                    <button
                      onClick={() => setSelectedProperties([])}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      }
    }

      // Handle property analysis results
      if (toolResult.analysis) {
        return (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-3">Property Analysis</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <span className="font-medium text-green-700">Market Value:</span>
                <div className="text-lg font-bold text-green-600">${toolResult.analysis?.market_value?.toLocaleString()}</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <span className="font-medium text-green-700">Price per sqft:</span>
                <div className="text-lg font-bold text-green-600">${toolResult.analysis?.price_per_sqft}</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <span className="font-medium text-green-700">Investment Score:</span>
                <div className="text-lg font-bold text-green-600">{toolResult.analysis?.investment_score}/100</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <span className="font-medium text-green-700">Days on Market:</span>
                <div className="text-lg font-bold text-green-600">{toolResult.analysis?.days_on_market}</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <span className="font-medium text-green-700">Neighborhood Rating:</span>
                <div className="text-lg font-bold text-green-600">{toolResult.analysis?.neighborhood_rating}/5</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <span className="font-medium text-green-700">Estimated Rent:</span>
                <div className="text-lg font-bold text-green-600">${toolResult.analysis?.estimated_rent}/month</div>
              </div>
            </div>
          </div>
        )
      }

      // Handle property comparison results
      if (toolResult.comparison) {
        return (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-3">Property Comparison</h4>
            <div className="space-y-4">
              {/* Price Comparison */}
              <div>
                <h5 className="font-medium text-purple-700 mb-2">Price Comparison</h5>
                <div className="grid grid-cols-1 gap-2">
                  {toolResult.comparison.price_comparison?.map((item: any, index: number) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.property_address || `Property ${item.property_id}`}</span>
                        <div className="text-right">
                          <div className="font-bold text-purple-600">${item.price?.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">${item.price_per_sqft}/sqft</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Feature Comparison */}
              <div>
                <h5 className="font-medium text-purple-700 mb-2">Feature Comparison</h5>
                <div className="grid grid-cols-1 gap-2">
                  <div className="grid grid-cols-1 gap-2">
                    {toolResult.comparison.feature_comparison?.map((item: any, index: number) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.property_address || `Property ${item.property_id}`}</span>
                          <div className="text-sm text-gray-600">
                            {item.bedrooms} beds • {item.bathrooms} baths • {item.sqft} sqft
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Recommendation */}
              {toolResult.comparison.recommendation && (
                <div className="bg-white p-3 rounded border border-purple-200">
                  <h5 className="font-medium text-purple-700 mb-1">Recommendation</h5>
                  <p className="text-sm text-gray-700">{toolResult.comparison.recommendation}</p>
                </div>
              )}
            </div>
          </div>
        )
      }

      // Handle showing setup results
      if (toolResult.showing) {
        return (
          <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-900 mb-3">Showing Setup</h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-orange-700 mb-2">Available Times</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {toolResult.showing.available_slots?.map((time: string, index: number) => (
                    <div key={index} className="bg-orange-50 p-2 rounded text-orange-700">
                      {time}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-orange-700 mb-1">Recommended Time</h5>
                <p className="text-lg font-bold text-orange-600">{toolResult.showing.preferred_time}</p>
                <p className="text-sm text-gray-600">Duration: {toolResult.showing.duration}</p>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-orange-700 mb-1">Details</h5>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Location:</span> {toolResult.showing.meeting_location}</p>
                  <p><span className="font-medium">Contact:</span> {toolResult.showing.contact_info}</p>
                  <p><span className="font-medium">Notes:</span> {toolResult.showing.notes}</p>
                </div>
              </div>
            </div>
          </div>
        )
      }

    // Fallback for other tool types
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Real Estate Assistant</h1>
                  <p className="text-sm text-gray-600">Powered by {formatName(brokerData.name)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <div className="text-xs text-gray-500 font-medium">Experience</div>
                <div className="text-sm text-gray-700">{brokerData.years_of_experience || brokerData.years_experience} years</div>
              </div>
              <div className="hidden md:block text-right">
                <div className="text-xs text-gray-500 font-medium">Specialty</div>
                <div className="text-sm text-gray-700">{brokerData.area_of_service || brokerData.service_area}</div>
              </div>
              <button
                onClick={() => setShowPerformanceDashboard(!showPerformanceDashboard)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                title="Performance Dashboard"
              >
                <Activity className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-4xl mx-auto w-full px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className="flex items-center space-x-2 p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              {action.icon}
              <span className="text-sm font-medium text-gray-700">{action.text}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 pb-4">
        <div className="bg-white rounded-lg shadow-sm border h-96 overflow-y-auto">
          <div className="p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs md:max-w-md lg:max-w-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-l-lg rounded-tr-lg' 
                      : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg'
                  } p-3`}>
                    <p className="text-sm">{message.text}</p>
                    {formatToolResult(message.toolResult)}
                    <div className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-900 rounded-r-lg rounded-tl-lg p-4 max-w-sm border border-blue-200 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-blue-700">{loadingMessage}</span>
                      <div className="text-xs text-blue-500 mt-1">
                        {loadingStage === 'analyzing' && 'Analyzing your request...'}
                        {loadingStage === 'searching' && 'Searching databases...'}
                        {loadingStage === 'processing' && 'Processing results...'}
                        {!loadingStage && 'Please wait while I process your request...'}
                      </div>
                      {/* Typing indicator */}
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-blue-400 mr-1">AI is typing</span>
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 w-full bg-blue-200 rounded-full h-1">
                    <motion.div 
                      className="bg-blue-500 h-1 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="max-w-4xl mx-auto w-full px-4 pb-6">
        <div className="flex space-x-3">
          <motion.div 
            className={`flex-1 bg-white rounded-lg shadow-sm border p-3 ${isLoading ? 'opacity-50' : ''}`}
            animate={isLoading ? { scale: 0.98 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isLoading ? "Processing your request..." : "Ask me about properties, market analysis, or anything real estate related..."}
              className="w-full resize-none border-none outline-none text-sm"
              rows={2}
              disabled={isLoading}
            />
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Performance Dashboard */}
      <PerformanceDashboard 
        isVisible={showPerformanceDashboard}
        onClose={() => setShowPerformanceDashboard(false)}
      />
    </div>
  )
} 