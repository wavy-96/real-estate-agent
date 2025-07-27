'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  User, 
  Phone, 
  Mail, 
  Home, 
  // DollarSign, 
  Bed, 
  // Bath, 
  // MapPin, 
  CheckCircle,
  ArrowLeft,
  // ArrowRight
} from 'lucide-react'

const clientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email'),
  rent_or_buy: z.enum(['rent', 'buy']),
  budget_min: z.number().min(0, 'Budget must be 0 or more'),
  budget_max: z.number().min(0, 'Budget must be 0 or more'),
  bedrooms: z.number().min(0, 'Bedrooms must be 0 or more'),
  bathrooms: z.number().min(0, 'Bathrooms must be 0 or more'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  amenities: z.array(z.string()).min(1, 'Please select at least one amenity'),
})

type ClientFormData = z.infer<typeof clientSchema>

interface NewClientOnboardingProps {
  brokerName: string
  onBack: () => void
  onComplete: (data: ClientFormData) => void
}

const availableAmenities = [
  'Parking',
  'Gym',
  'Pool',
  'Balcony',
  'Garden',
  'Security',
  'Elevator',
  'Air Conditioning',
  'Dishwasher',
  'Fireplace',
  'Walk-in Closet',
  'Hardwood Floors',
]

export default function NewClientOnboarding({ 
  brokerName, 
  onBack, 
  onComplete 
}: NewClientOnboardingProps) {
  const [step, setStep] = useState(1)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    mode: 'onChange',
  })

  const watchedValues = watch()

  const nextStep = () => {
    if (step < 6) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSendOTP = async () => {
    if (!watchedValues.email) {
      setError('Please enter an email address first')
      return
    }

    try {
      const response = await fetch('/api/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: watchedValues.email }),
      })

      const data = await response.json()

      if (data.success) {
        setOtpSent(true)
        setError('')
        // For demo purposes, we'll auto-verify after a delay
        setTimeout(() => setOtpVerified(true), 2000)
      } else {
        setError(data.error || 'Failed to send OTP')
      }
    } catch (error) {
      setError('Failed to send OTP')
    }
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
    setValue('amenities', selectedAmenities)
  }

  const onSubmit = (data: ClientFormData) => {
    data.amenities = selectedAmenities
    onComplete(data)
  }

  const canProceed = () => {
    switch (step) {
      case 1: return watchedValues.name && !errors.name
      case 2: return watchedValues.email && !errors.email && otpVerified
      case 3: return watchedValues.phone && !errors.phone
      case 4: return watchedValues.rent_or_buy && watchedValues.budget_min && watchedValues.budget_max
      case 5: return watchedValues.bedrooms !== undefined && watchedValues.bathrooms !== undefined && watchedValues.location
      case 6: return selectedAmenities.length > 0
      default: return false
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
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
              <p className="text-gray-600">Let's find your perfect home</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Step {step} of 6</span>
              <span className="text-sm text-gray-500">{Math.round((step / 6) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 6) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Name */}
              {step === 1 && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
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

              {/* Step 2: Email & OTP */}
              {step === 2 && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Email Address</h2>
                      <p className="text-gray-600">We&apos;ll send you a verification code</p>
                    </div>
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                  
                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}
                  
                  {watchedValues.email && !errors.email && (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={otpSent}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                    >
                      {otpSent ? 'OTP Sent!' : 'Send Verification Code'}
                    </button>
                  )}

                  {otpVerified && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Email verified successfully!</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Phone */}
              {step === 3 && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Phone Number</h2>
                      <p className="text-gray-600">We&apos;ll contact you about properties</p>
                    </div>
                  </div>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone.message}</p>
                  )}
                </motion.div>
              )}

              {/* Step 4: Rent/Buy & Budget */}
              {step === 4 && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Home className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">What are you looking for?</h2>
                      <p className="text-gray-600">Help us understand your needs</p>
                    </div>
                  </div>

                  {/* Rent or Buy */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">I want to:</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setValue('rent_or_buy', 'rent')}
                        className={`p-4 rounded-xl border-2 transition-colors ${
                          watchedValues.rent_or_buy === 'rent'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        Rent
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue('rent_or_buy', 'buy')}
                        className={`p-4 rounded-xl border-2 transition-colors ${
                          watchedValues.rent_or_buy === 'buy'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        Buy
                      </button>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Budget Range:</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        {...register('budget_min', { valueAsNumber: true })}
                        type="number"
                        placeholder="Min"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      />
                      <input
                        {...register('budget_max', { valueAsNumber: true })}
                        type="number"
                        placeholder="Max"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Bedrooms, Bathrooms, Location */}
              {step === 5 && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-pink-100 p-2 rounded-full">
                      <Bed className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
                      <p className="text-gray-600">Tell us about your ideal property</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Bedrooms:</label>
                      <input
                        {...register('bedrooms', { valueAsNumber: true })}
                        type="number"
                        min="0"
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Bathrooms:</label>
                      <input
                        {...register('bathrooms', { valueAsNumber: true })}
                        type="number"
                        min="0"
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Preferred Location:</label>
                    <input
                      {...register('location')}
                      type="text"
                      placeholder="e.g., Downtown, North York, Scarborough"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-base"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 6: Amenities */}
              {step === 6 && (
                <motion.div
                  key="amenities"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <CheckCircle className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Preferred Amenities</h2>
                      <p className="text-gray-600">Select the amenities you&apos;d like</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {availableAmenities.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-3 rounded-xl border-2 transition-colors text-sm ${
                          selectedAmenities.includes(amenity)
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
              {step < 6 ? (
                                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Next
                  </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canProceed()}
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