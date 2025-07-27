'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, MapPin, Calendar } from 'lucide-react'

const brokerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  years_of_experience: z.number().min(0, 'Years of experience must be 0 or more'),
  area_of_service: z.string().min(2, 'Area of service must be at least 2 characters'),
})

type BrokerFormData = z.infer<typeof brokerSchema>

interface BrokerOnboardingProps {
  onComplete: (data: BrokerFormData) => void
}

export default function BrokerOnboarding({ onComplete }: BrokerOnboardingProps) {
  const [step, setStep] = useState(1)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<BrokerFormData>({
    resolver: zodResolver(brokerSchema),
    mode: 'onChange',
  })

  const watchedName = watch('name')
  const watchedExperience = watch('years_of_experience')
  const watchedArea = watch('area_of_service')

  const onSubmit = (data: BrokerFormData) => {
    console.log('Form submitted:', data)
    onComplete(data)
  }

  const nextStep = async () => {
    if (step < 3) {
      // Validate current step before proceeding
      let isValidStep = false
      if (step === 1) {
        isValidStep = await trigger('name')
      } else if (step === 2) {
        isValidStep = await trigger('years_of_experience')
      }
      
      if (isValidStep) {
        setStep(step + 1)
      }
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return watchedName && watchedName.length >= 2
      case 2: return watchedExperience !== undefined && watchedExperience >= 0
      case 3: return watchedArea && watchedArea.length >= 2
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Welcome to Real Estate Pro
            </h1>
            <p className="text-gray-600 text-lg">
              Let's get to know you better to personalize your experience
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Step {step} of 3</span>
              <span className="text-sm font-medium text-gray-600">{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Step 1: Name */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">What's your name?</h2>
                    <p className="text-gray-600 mt-1">We'll use this to personalize your experience</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm font-medium">{errors.name.message}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Years of Experience */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shadow-sm">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Years of Experience</h2>
                    <p className="text-gray-600 mt-1">How long have you been in real estate?</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    {...register('years_of_experience', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="Enter years of experience"
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                  {errors.years_of_experience && (
                    <p className="text-red-500 text-sm font-medium">{errors.years_of_experience.message}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Area of Service */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center shadow-sm">
                    <MapPin className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Area of Service</h2>
                    <p className="text-gray-600 mt-1">Where do you primarily work?</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    {...register('area_of_service')}
                    type="text"
                    placeholder="e.g., Downtown Toronto, GTA, Vancouver"
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                  {errors.area_of_service && (
                    <p className="text-red-500 text-sm font-medium">{errors.area_of_service.message}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-4 pt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 text-base shadow-sm"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-base shadow-lg hover:shadow-xl"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canProceed()}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-base shadow-lg hover:shadow-xl"
                >
                  Complete Setup
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
} 