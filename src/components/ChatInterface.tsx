'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, UserPlus, ArrowLeft } from 'lucide-react'

interface ChatInterfaceProps {
  brokerName: string
  onBack: () => void
  onExistingClient: () => void
  onNewClient: () => void
}

export default function ChatInterface({ 
  brokerName, 
  onBack, 
  onExistingClient, 
  onNewClient
}: ChatInterfaceProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleOptionClick = (callback: () => void) => {
    setIsVisible(false)
    setTimeout(callback, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chat with {brokerName}</h1>
              <p className="text-gray-600 mt-1">How can I help you today?</p>
            </div>
          </div>

          <AnimatePresence>
            {isVisible && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Existing Client Option */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionClick(onExistingClient)}
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-white/20"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-sm">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-lg font-semibold mb-1">Existing Client</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        Welcome back! Let me show you your saved listings and recent activity.
                      </p>
                    </div>
                  </div>
                </motion.button>

                {/* New Client Option */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionClick(onNewClient)}
                  className="w-full p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-white/20"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-sm">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-lg font-semibold mb-1">New Client</h3>
                      <p className="text-emerald-100 text-sm leading-relaxed">
                        Let&apos;s get to know you and find your perfect home together.
                      </p>
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
} 