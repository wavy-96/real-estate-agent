'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Custom CSS for hiding scrollbar
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Star, 
  Calendar,
  DollarSign,
  MapPin,
  BarChart3,
  Activity,
  Target,
  Award
} from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  score: number
  qualification: 'Hot' | 'Warm' | 'Cold'
  created_at: string
  preferences: {
    budget_min: number
    budget_max: number
    rent_or_buy: 'rent' | 'buy'
    bedrooms: number
    bathrooms: number
    location: string
    amenities: string[]
  }
  recommendations: string[]
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  created_at: string
  last_contact: string
  total_properties_viewed: number
  saved_properties: number
}

interface ChatSummary {
  client_id: string
  client_name: string
  last_message: string
  message_count: number
  last_activity: string
  sentiment: 'positive' | 'neutral' | 'negative'
  key_topics: string[]
}

interface DashboardProps {
  onBack: () => void
}

export default function Dashboard({ onBack }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'clients' | 'analytics' | 'chats'>('overview')
  const [leads, setLeads] = useState<Lead[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [chatSummaries, setChatSummaries] = useState<ChatSummary[]>([])

  useEffect(() => {
    // Load mock data
    loadMockData()
  }, [])

  const loadMockData = () => {
    // Load leads from localStorage (new users) and combine with mock data
    const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]')
    
    // Mock leads data (fallback)
    const mockLeads: Lead[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1-555-0123',
        score: 85,
        qualification: 'Hot',
        created_at: '2024-01-15T10:30:00Z',
        preferences: {
          budget_min: 400000,
          budget_max: 600000,
          rent_or_buy: 'buy',
          bedrooms: 3,
          bathrooms: 2,
          location: 'Downtown',
          amenities: ['Parking', 'Gym', 'Balcony', 'Security']
        },
        recommendations: [
          'High priority lead - follow up within 24 hours',
          'Schedule property viewings immediately'
        ]
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '+1-555-0456',
        score: 65,
        qualification: 'Warm',
        created_at: '2024-01-14T14:20:00Z',
        preferences: {
          budget_min: 250000,
          budget_max: 350000,
          rent_or_buy: 'buy',
          bedrooms: 2,
          bathrooms: 1,
          location: 'Suburbs',
          amenities: ['Parking', 'Garden']
        },
        recommendations: [
          'Good potential - follow up within 48 hours',
          'Send personalized property recommendations'
        ]
      }
    ]
    
    // Combine stored leads (new users) with mock leads
    const allLeads = [...storedLeads, ...mockLeads]

    // Mock clients data
    const mockClients: Client[] = [
      {
        id: '1',
        name: 'Emma Davis',
        email: 'emma.davis@email.com',
        phone: '+1-555-0789',
        status: 'active',
        created_at: '2023-12-01T09:15:00Z',
        last_contact: '2024-01-15T16:45:00Z',
        total_properties_viewed: 12,
        saved_properties: 3
      },
      {
        id: '2',
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        phone: '+1-555-0321',
        status: 'active',
        created_at: '2023-11-15T11:30:00Z',
        last_contact: '2024-01-14T13:20:00Z',
        total_properties_viewed: 8,
        saved_properties: 2
      }
    ]

    // Mock chat summaries
    const mockChatSummaries: ChatSummary[] = [
      {
        client_id: '1',
        client_name: 'Emma Davis',
        last_message: 'I really liked the property on Oak Street. Can we schedule a viewing?',
        message_count: 24,
        last_activity: '2024-01-15T16:45:00Z',
        sentiment: 'positive',
        key_topics: ['Property viewing', 'Oak Street', 'Scheduling']
      },
      {
        client_id: '2',
        client_name: 'David Wilson',
        last_message: 'What are the current market trends in the downtown area?',
        message_count: 18,
        last_activity: '2024-01-14T13:20:00Z',
        sentiment: 'neutral',
        key_topics: ['Market trends', 'Downtown', 'Analysis']
      }
    ]

    setLeads(allLeads)
    setClients(mockClients)
    setChatSummaries(mockChatSummaries)
  }

  const getQualificationColor = (qualification: string) => {
    switch (qualification) {
      case 'Hot': return 'bg-red-100 text-red-800'
      case 'Warm': return 'bg-yellow-100 text-yellow-800'
      case 'Cold': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800'
      case 'neutral': return 'bg-gray-100 text-gray-800'
      case 'negative': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'leads', label: 'Leads', icon: <Target className="w-4 h-4" /> },
    { id: 'clients', label: 'Clients', icon: <Users className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'chats', label: 'Chats', icon: <MessageSquare className="w-4 h-4" /> },
  ]

  return (
    <>
      <style jsx global>{scrollbarHideStyles}</style>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Real Estate Agent Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Premium Agent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            <div className="flex space-x-4 md:space-x-8 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-2 md:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Leads</p>
                      <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Clients</p>
                      <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Chat Sessions</p>
                      <p className="text-2xl font-bold text-gray-900">{chatSummaries.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Hot Leads</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {leads.filter(l => l.qualification === 'Hot').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

                            {/* Recent Activity */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leads</h3>
                  <div className="space-y-4">
                    {leads.slice(0, 3).map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <p className="text-sm text-gray-600">{lead.email}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualificationColor(lead.qualification)}`}>
                            {lead.qualification}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">Score: {lead.score}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Clients</h3>
                  <div className="space-y-4">
                    {clients.slice(0, 3).map((client, index) => (
                      <div key={client.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          <img 
                            src={index % 2 === 0 
                              ? "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" 
                              : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                            } 
                            alt={client.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{client.name}</p>
                          <p className="text-sm text-gray-600 truncate">{client.email}</p>
                          <div className="flex items-center mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {client.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Chats</h3>
                  <div className="space-y-4">
                    {chatSummaries.slice(0, 3).map((chat) => (
                      <div key={chat.client_id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-gray-900 truncate flex-1 mr-2">{chat.client_name}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getSentimentColor(chat.sentiment)}`}>
                            {chat.sentiment}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 break-words leading-relaxed">{chat.last_message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{chat.message_count} messages</span>
                          <span className="text-xs text-gray-500">{new Date(chat.last_activity).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'leads' && (
            <motion.div
              key="leads"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Lead Management</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferences</th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leads.map((lead, index) => (
                        <tr key={lead.id} className={`hover:bg-gray-50 ${index === 0 && lead.created_at && new Date(lead.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000 ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}>
                                                      <td className="px-3 md:px-6 py-4">
                              <div className="min-w-0">
                                <div className="flex items-center space-x-2">
                                  <div className="text-sm font-medium text-gray-900 truncate">{lead.name}</div>
                                  {index === 0 && lead.created_at && new Date(lead.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000 && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">New</span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 truncate">{lead.email}</div>
                                <div className="text-sm text-gray-500 truncate">{lead.phone}</div>
                              </div>
                            </td>
                          <td className="px-3 md:px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{lead.score}/100</div>
                          </td>
                          <td className="px-3 md:px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualificationColor(lead.qualification)}`}>
                              {lead.qualification}
                            </span>
                          </td>
                          <td className="px-3 md:px-6 py-4">
                            <div className="text-sm text-gray-900 min-w-0">
                              <div className="truncate">${lead.preferences.budget_min.toLocaleString()} - ${lead.preferences.budget_max.toLocaleString()}</div>
                              <div className="text-gray-500 truncate">{lead.preferences.bedrooms} bed, {lead.preferences.bathrooms} bath</div>
                              <div className="text-gray-500 truncate">{lead.preferences.location}</div>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-4 text-sm text-gray-500">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'clients' && (
            <motion.div
              key="clients"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Client Management</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {clients.map((client, index) => (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-3 md:px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                <img 
                                  src={index % 2 === 0 
                                    ? "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" 
                                    : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                                  } 
                                  alt={client.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">{client.name}</div>
                                <div className="text-sm text-gray-500 truncate">{client.email}</div>
                                <div className="text-sm text-gray-500 truncate">{client.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {client.status}
                            </span>
                          </td>
                          <td className="px-3 md:px-6 py-4">
                            <div className="text-sm text-gray-900 min-w-0">
                              <div className="truncate">Viewed: {client.total_properties_viewed} properties</div>
                              <div className="text-gray-500 truncate">Saved: {client.saved_properties} properties</div>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-4 text-sm text-gray-500">
                            {new Date(client.last_contact).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Scoring Distribution</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Hot Leads</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">30%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Warm Leads</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Cold Leads</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">25%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Chat Sentiment Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Positive</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">60%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Neutral</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-gray-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">30%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Negative</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'chats' && (
            <motion.div
              key="chats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Chat Summaries</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {chatSummaries.map((chat) => (
                    <div key={chat.client_id} className="p-4 md:p-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="text-lg font-medium text-gray-900 truncate flex-1 mr-3">{chat.client_name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getSentimentColor(chat.sentiment)}`}>
                            {chat.sentiment}
                          </span>
                        </div>
                        <p className="text-gray-600 break-words leading-relaxed">{chat.last_message}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
                          <span>{chat.message_count} messages</span>
                          <span>Last activity: {new Date(chat.last_activity).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Key Topics:</p>
                          <div className="flex flex-wrap gap-2">
                            {chat.key_topics.map((topic, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  )
} 