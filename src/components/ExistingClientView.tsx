'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Home, 
  DollarSign, 
  MapPin, 
  Bed, 
  Bath, 
  MessageCircle,
  Heart,
  Share2,
  // Calendar
} from 'lucide-react'
import { Client, Listing } from '@/types/database'

interface ExistingClientViewProps {
  brokerName: string
  onBack: () => void
  onStartChat: () => void
}

// Mock data for demo purposes
const mockClient: Client = {
  id: '1',
  name: 'John Smith',
  phone: '+1 (555) 123-4567',
  email: 'john.smith@email.com',
  broker_id: '1',
  rent_or_buy: 'buy',
  budget_min: 500000,
  budget_max: 800000,
  bedrooms: 3,
  bathrooms: 2,
  location: 'Downtown Toronto',
  amenities: ['Parking', 'Gym', 'Balcony'],
  created_at: '2024-01-15',
  updated_at: '2024-01-15',
}

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Modern Downtown Condo',
    description: 'Beautiful 2-bedroom condo with stunning city views',
    price: 650000,
    bedrooms: 2,
    bathrooms: 2,
    location: 'Downtown Toronto',
    amenities: ['Parking', 'Gym', 'Balcony', 'Air Conditioning'],
    images: ['/api/placeholder/400/300'],
    broker_id: '1',
    client_id: '1',
    shown_to_client: true,
    created_at: '2024-01-10',
    updated_at: '2024-01-10',
  },
  {
    id: '2',
    title: 'Family Home in North York',
    description: 'Spacious 4-bedroom family home with backyard',
    price: 750000,
    bedrooms: 4,
    bathrooms: 3,
    location: 'North York',
    amenities: ['Parking', 'Garden', 'Fireplace', 'Hardwood Floors'],
    images: ['/api/placeholder/400/300'],
    broker_id: '1',
    client_id: '1',
    shown_to_client: true,
    created_at: '2024-01-08',
    updated_at: '2024-01-08',
  },
]

export default function ExistingClientView({ 
  brokerName, 
  onBack, 
  onStartChat 
}: ExistingClientViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'chat'>('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {mockClient.name}!</h1>
                <p className="text-gray-600">Your personalized real estate experience</p>
              </div>
            </div>
            <button
              onClick={onStartChat}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat with {brokerName}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'listings', label: 'Saved Listings', icon: Heart },
              { id: 'chat', label: 'Chat History', icon: MessageCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Client Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Home className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Looking to</p>
                        <p className="font-medium capitalize">{mockClient.rent_or_buy}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="font-medium">
                          ${mockClient.budget_min.toLocaleString()} - ${mockClient.budget_max.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <MapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Preferred Location</p>
                        <p className="font-medium">{mockClient.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <Bed className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Property Type</p>
                        <p className="font-medium">
                          {mockClient.bedrooms} bed, {mockClient.bathrooms} bath
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{mockListings.length}</div>
                  <p className="text-gray-600">Saved Listings</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">12</div>
                  <p className="text-gray-600">Messages</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
                  <p className="text-gray-600">Viewings</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <motion.div
              key="listings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Saved Listings</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockListings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="h-48 bg-gray-200 relative">
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors">
                          <Heart className="w-5 h-5 text-red-500" />
                        </button>
                        <button className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors">
                          <Share2 className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{listing.title}</h3>
                      <p className="text-gray-600 mb-4">{listing.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-blue-600">
                          ${listing.price.toLocaleString()}
                        </div>
                        <div className="flex items-center space-x-4 text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Bed className="w-4 h-4" />
                            <span>{listing.bedrooms}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Bath className="w-4 h-4" />
                            <span>{listing.bathrooms}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{listing.location}</span>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat History Tab */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Chat History</h2>
                <button
                  onClick={onStartChat}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Start New Chat
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="space-y-4">
                  {[
                    { date: 'Today', message: 'I found a great property that matches your criteria!', time: '2:30 PM' },
                    { date: 'Yesterday', message: 'Let me know if you\'d like to schedule a viewing.', time: '4:15 PM' },
                    { date: 'Jan 15', message: 'Welcome! I\'m here to help you find your perfect home.', time: '10:00 AM' },
                  ].map((chat, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">{brokerName.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{brokerName}</span>
                          <span className="text-sm text-gray-500">{chat.date} at {chat.time}</span>
                        </div>
                        <p className="text-gray-700">{chat.message}</p>
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
  )
} 