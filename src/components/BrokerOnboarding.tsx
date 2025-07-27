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
  } = useForm<BrokerFormData>({
    resolver: zodResolver(brokerSchema),
    mode: 'onChange',
  })

  const watchedName = watch('name')
  const watchedExperience = watch('years_of_experience')
  // const watchedArea = watch('area_of_service')

  const onSubmit = (data: BrokerFormData) => {
    onComplete(data)
  }

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Real Estate Pro
            </h1>
            <p className="text-gray-600">
              Let's get to know you better to personalize your experience
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Step {step} of 3</span>
              <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Name */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">What&apos;s your name?</h2>
                    <p className="text-gray-600">We&apos;ll use this to personalize your experience</p>
                  </div>
                </div>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </motion.div>
            )}

            {/* Step 2: Years of Experience */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Years of Experience</h2>
                    <p className="text-gray-600">How long have you been in real estate?</p>
                  </div>
                </div>
                <input
                  {...register('years_of_experience', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  placeholder="Enter years of experience"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                />
                {errors.years_of_experience && (
                  <p className="text-red-500 text-sm">{errors.years_of_experience.message}</p>
                )}
              </motion.div>
            )}

            {/* Step 3: Area of Service */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Area of Service</h2>
                    <p className="text-gray-600">Where do you primarily work?</p>
                  </div>
                </div>
                <input
                  {...register('area_of_service')}
                  type="text"
                  placeholder="e.g., Downtown Toronto, GTA, Vancouver"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                />
                {errors.area_of_service && (
                  <p className="text-red-500 text-sm">{errors.area_of_service.message}</p>
                )}
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-3 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      (step === 1 && !watchedName) ||
                      (step === 2 && !watchedExperience)
                    }
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Next
                  </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isValid}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
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