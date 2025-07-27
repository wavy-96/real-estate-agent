'use client'

import { motion } from 'framer-motion'
import { MessageCircle, ArrowRight, RefreshCw, Info } from 'lucide-react'

interface LandingPageProps {
  brokerName: string
  onChatClick: () => void
  onResetDemo: () => void
  onDashboardClick: () => void
}

export default function LandingPage({ brokerName, onChatClick, onResetDemo, onDashboardClick }: LandingPageProps) {
  // Helper function to properly capitalize name
  const formatName = (name: string) => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{ zIndex: 1 }}
          onEnded={() => {
            const video = document.querySelector('video');
            if (video) video.currentTime = 0;
          }}
          onError={(e) => {
            console.error('Video error:', e);
            // Hide video and show fallback
            const videoElement = e.target as HTMLVideoElement;
            videoElement.style.display = 'none';
          }}
          onLoadStart={() => console.log('Video loading started')}
          onCanPlay={() => console.log('Video can play')}
          onLoadedData={() => console.log('Video data loaded')}
          onPlay={() => console.log('Video started playing')}
        >
          <source src="/agent-bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Fallback background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
        {/* Overlay - temporarily reduced for testing */}
        <div className="absolute inset-0 bg-black bg-opacity-10" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Greeting */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Hi, I&apos;m{' '}
            <span className="text-blue-400">{formatName(brokerName)}</span>!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-12"
          >
            Let&apos;s find you your next home.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onChatClick}
            className="group bg-white text-gray-900 px-8 py-4 rounded-full text-lg md:text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-3 mx-auto"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Chat with me</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 text-gray-300 text-sm md:text-base"
          >
            <p>Available 24/7 • Free Consultation • Expert Guidance</p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-8 flex items-center justify-center space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDashboardClick}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              title="Dashboard"
            >
              <Info className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onResetDemo}
              className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
              title="Reset Demo"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-8 hidden md:block"
        >
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4 text-white">
            <div className="text-sm font-medium">Expert Real Estate</div>
            <div className="text-xs opacity-75">Professional Service</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute top-8 right-8 hidden md:block"
        >
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4 text-white">
            <div className="text-sm font-medium">Local Market</div>
            <div className="text-xs opacity-75">Expert Knowledge</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 