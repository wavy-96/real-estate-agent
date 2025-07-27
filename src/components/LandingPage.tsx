'use client'

import { motion } from 'framer-motion'
import { MessageCircle, ArrowRight, RefreshCw, Info } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface LandingPageProps {
  brokerName: string
  onChatClick: () => void
  onResetDemo: () => void
  onDashboardClick: () => void
}

export default function LandingPage({ brokerName, onChatClick, onResetDemo, onDashboardClick }: LandingPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Helper function to properly capitalize name
  const formatName = (name: string) => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Ensure video plays
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current
      
      const playVideo = async () => {
        try {
          await video.play()
          console.log('Video playing successfully')
        } catch (error) {
          console.error('Video autoplay failed:', error)
          // Try to play on user interaction
          const handleUserInteraction = async () => {
            try {
              await video.play()
              console.log('Video started playing on user interaction')
              document.removeEventListener('click', handleUserInteraction)
              document.removeEventListener('touchstart', handleUserInteraction)
            } catch (err) {
              console.error('Video play failed on user interaction:', err)
            }
          }
          document.addEventListener('click', handleUserInteraction)
          document.addEventListener('touchstart', handleUserInteraction)
        }
      }

      playVideo()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-40"
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
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20" />
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
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl"
          >
            Hi, I&apos;m{' '}
            <span className="text-blue-400 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{formatName(brokerName)}</span>!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-12 drop-shadow-lg"
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
            className="group bg-white/90 backdrop-blur-sm text-gray-900 px-10 py-5 rounded-full text-lg md:text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-4 mx-auto border border-white/20"
          >
            <MessageCircle className="w-7 h-7" />
            <span>Chat with me</span>
            <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
          </motion.button>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 text-gray-300 text-sm md:text-base"
          >
            <p className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 inline-block">Available 24/7 • Free Consultation • Expert Guidance</p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-8 flex items-center justify-center space-x-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDashboardClick}
              className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              title="Dashboard"
            >
              <Info className="w-6 h-6" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onResetDemo}
              className="p-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              title="Reset Demo"
            >
              <RefreshCw className="w-6 h-6" />
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
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/20 shadow-xl">
            <div className="text-sm font-semibold">Expert Real Estate</div>
            <div className="text-xs opacity-75">Professional Service</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute top-8 right-8 hidden md:block"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/20 shadow-xl">
            <div className="text-sm font-semibold">Local Market</div>
            <div className="text-xs opacity-75">Expert Knowledge</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 