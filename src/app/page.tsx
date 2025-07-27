'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import BrokerOnboarding from '@/components/BrokerOnboarding'
import LandingPage from '@/components/LandingPage'
import ChatInterface from '@/components/ChatInterface'
import AIChatInterface from '@/components/AIChatInterface'
import NewClientOnboarding from '@/components/NewClientOnboarding'
import ExistingClientView from '@/components/ExistingClientView'
import Dashboard from '@/components/Dashboard'
import { Broker, Client } from '@/types/database'

type AppView = 
  | 'onboarding' 
  | 'landing' 
  | 'chat-options' 
  | 'ai-chat'
  | 'new-client' 
  | 'existing-client'
  | 'dashboard'

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>('onboarding')
  const [brokerData, setBrokerData] = useState<Broker | null>(null)
  const [clientData, setClientData] = useState<Client | null>(null)

  // Check if broker has already completed onboarding
  useEffect(() => {
    const savedBroker = localStorage.getItem('brokerData')
    if (savedBroker) {
      const broker = JSON.parse(savedBroker)
      setBrokerData(broker)
      setCurrentView('landing')
    }
  }, [])

  const handleBrokerOnboardingComplete = (data: { name: string; years_of_experience: number; area_of_service: string }) => {
    const broker: Broker = {
      id: '1', // In real app, this would come from database
      name: data.name,
      years_of_experience: data.years_of_experience,
      area_of_service: data.area_of_service,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    setBrokerData(broker)
    localStorage.setItem('brokerData', JSON.stringify(broker))
    setCurrentView('landing')
  }

  const handleChatClick = () => {
    setCurrentView('chat-options')
  }

  const handleBackToLanding = () => {
    setCurrentView('landing')
  }

  const handleExistingClient = () => {
    // Load existing client data (in real app, this would come from database)
    const existingClient: Client = {
      id: 'existing-1',
      name: 'Emma Davis',
      phone: '+1-555-0789',
      email: 'emma.davis@email.com',
      broker_id: brokerData?.id || '1',
      rent_or_buy: 'buy',
      budget_min: 400000,
      budget_max: 600000,
      bedrooms: 3,
      bathrooms: 2,
      location: 'Downtown',
      amenities: ['Parking', 'Gym', 'Balcony'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setClientData(existingClient)
    setCurrentView('existing-client')
  }

  const handleNewClient = () => {
    setCurrentView('new-client')
  }

  const handleAIChat = () => {
    setCurrentView('ai-chat')
  }

  const handleDashboard = () => {
    setCurrentView('dashboard')
  }

  const handleNewClientComplete = async (data: { name: string; phone: string; email: string; rent_or_buy: 'rent' | 'buy'; budget_min: number; budget_max: number; bedrooms: number; bathrooms: number; location: string; amenities: string[] }) => {
    const client: Client = {
      id: '1', // In real app, this would come from database
      name: data.name,
      phone: data.phone,
      email: data.email,
      broker_id: brokerData?.id || '1',
      rent_or_buy: data.rent_or_buy,
      budget_min: data.budget_min,
      budget_max: data.budget_max,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      location: data.location,
      amenities: data.amenities,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    setClientData(client)
    
    // Calculate lead score
    const { calculateLeadScore } = await import('@/lib/lead-scoring')
    const leadScore = calculateLeadScore({
      budget_min: data.budget_min,
      budget_max: data.budget_max,
      rent_or_buy: data.rent_or_buy,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      location: data.location,
      amenities: data.amenities,
    })
    
    // Store lead data in localStorage for dashboard
    const newLead = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      score: leadScore.totalScore,
      qualification: leadScore.qualification,
      created_at: new Date().toISOString(),
      preferences: {
        budget_min: data.budget_min,
        budget_max: data.budget_max,
        rent_or_buy: data.rent_or_buy,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        location: data.location,
        amenities: data.amenities,
      },
      recommendations: leadScore.recommendations
    }
    
    // Store in localStorage for demo
    const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]')
    existingLeads.unshift(newLead) // Add to beginning
    localStorage.setItem('leads', JSON.stringify(existingLeads))
    localStorage.setItem('leadScore', JSON.stringify(leadScore))
    
    // Store client data for chat
    localStorage.setItem('clientData', JSON.stringify(client))
    
    // Redirect to AI chat with automatic property search
    setCurrentView('ai-chat')
  }

  const handleStartChat = () => {
    // In real app, this would open a chat interface
    console.log('Starting chat...')
  }

  const handleResetDemo = () => {
    // Clear all stored data
    localStorage.removeItem('brokerData')
    localStorage.removeItem('clientData')
    // Reset to onboarding
    setBrokerData(null)
    setClientData(null)
    setCurrentView('onboarding')
  }

  return (
    <div className="min-h-screen">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <AnimatePresence mode="wait">
        {currentView === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BrokerOnboarding onComplete={handleBrokerOnboardingComplete} />
          </motion.div>
        )}

        {currentView === 'landing' && brokerData && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage 
              brokerName={brokerData.name} 
              onChatClick={handleChatClick}
              onResetDemo={handleResetDemo}
              onDashboardClick={handleDashboard}
            />
          </motion.div>
        )}

        {currentView === 'chat-options' && brokerData && (
          <motion.div
            key="chat-options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ChatInterface
              brokerName={brokerData.name}
              onBack={handleBackToLanding}
              onExistingClient={handleExistingClient}
              onNewClient={handleNewClient}
            />
          </motion.div>
        )}

        {currentView === 'new-client' && brokerData && (
          <motion.div
            key="new-client"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <NewClientOnboarding
              brokerName={brokerData.name}
              onBack={() => setCurrentView('chat-options')}
              onComplete={handleNewClientComplete}
            />
          </motion.div>
        )}

        {currentView === 'existing-client' && brokerData && (
          <motion.div
            key="existing-client"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ExistingClientView
              brokerName={brokerData.name}
              onBack={() => setCurrentView('chat-options')}
              onStartChat={() => setCurrentView('ai-chat')}
            />
          </motion.div>
        )}

        {currentView === 'ai-chat' && brokerData && (
          <motion.div
            key="ai-chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AIChatInterface
              brokerData={brokerData}
              clientData={clientData}
              onBack={() => setCurrentView('chat-options')}
              isNewUser={!!clientData}
            />
          </motion.div>
        )}

        {currentView === 'dashboard' && brokerData && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dashboard
              onBack={() => setCurrentView('landing')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
