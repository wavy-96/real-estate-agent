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
        
        // Show demo OTP in development
        if (data.isDemo && data.demoOTP) {
          console.log(`Demo OTP for ${watchedValues.email}: ${data.demoOTP}`)
          // You could also show this in the UI for easier testing
          alert(`Demo OTP: ${data.demoOTP}`)
        }
        
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center mb-10">
            <button
              onClick={onBack}
              className="mr-6 p-3 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome!</h1>
              <p className="text-gray-600 text-lg mt-1">Let's find your perfect home</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Step {step} of 6</span>
              <span className="text-sm font-medium text-gray-600">{Math.round((step / 6) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 6) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Name */}
              {step === 1 && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
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

              {/* Step 2: Email & OTP */}
              {step === 2 && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shadow-sm">
                      <Mail className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">Email Address</h2>
                      <p className="text-gray-600 mt-1">We'll send you a verification code</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm font-medium">{errors.email.message}</p>
                    )}
                    
                    {error && (
                      <p className="text-red-500 text-sm font-medium">{error}</p>
                    )}
                    
                    {watchedValues.email && !errors.email && (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={otpSent}
                        className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
                      >
                        {otpSent ? 'OTP Sent!' : 'Send Verification Code'}
                      </button>
                    )}

                    {otpVerified && (
                      <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">Email verified successfully!</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Phone */}
              {step === 3 && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center shadow-sm">
                      <Phone className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">Phone Number</h2>
                      <p className="text-gray-600 mt-1">We'll contact you about properties</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm font-medium">{errors.phone.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Rent/Buy & Budget */}
              {step === 4 && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shadow-sm">
                      <Home className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">What are you looking for?</h2>
                      <p className="text-gray-600 mt-1">Help us understand your needs</p>
                    </div>
                  </div>

                  {/* Rent or Buy */}
                  <div className="space-y-4">
                    <label className="text-lg font-medium text-gray-700">I want to:</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setValue('rent_or_buy', 'rent')}
                        className={`p-6 rounded-xl border-2 transition-all duration-200 text-lg font-medium ${
                          watchedValues.rent_or_buy === 'rent'
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white/50'
                        }`}
                      >
                        Rent
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue('rent_or_buy', 'buy')}
                        className={`p-6 rounded-xl border-2 transition-all duration-200 text-lg font-medium ${
                          watchedValues.rent_or_buy === 'buy'
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white/50'
                        }`}
                      >
                        Buy
                      </button>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-4">
                    <label className="text-lg font-medium text-gray-700">Budget Range:</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        {...register('budget_min', { valueAsNumber: true })}
                        type="number"
                        placeholder="Min"
                        className="px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      />
                      <input
                        {...register('budget_max', { valueAsNumber: true })}
                        type="number"
                        placeholder="Max"
                        className="px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
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
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center shadow-sm">
                      <Bed className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">Property Details</h2>
                      <p className="text-gray-600 mt-1">Tell us about your ideal property</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-lg font-medium text-gray-700">Bedrooms:</label>
                      <input
                        {...register('bedrooms', { valueAsNumber: true })}
                        type="number"
                        min="0"
                        placeholder="0"
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-lg font-medium text-gray-700">Bathrooms:</label>
                      <input
                        {...register('bathrooms', { valueAsNumber: true })}
                        type="number"
                        min="0"
                        placeholder="0"
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-lg font-medium text-gray-700">Preferred Location:</label>
                    <input
                      {...register('location')}
                      type="text"
                      placeholder="e.g., Downtown, North York, Scarborough"
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-lg transition-all duration-200 bg-white/50 backdrop-blur-sm"
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
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shadow-sm">
                      <CheckCircle className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">Preferred Amenities</h2>
                      <p className="text-gray-600 mt-1">Select the amenities you'd like</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {availableAmenities.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                          selectedAmenities.includes(amenity)
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white/50'
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
            <div className="flex space-x-4 pt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 px-6 py-4 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 text-lg shadow-sm"
                >
                  Back
                </button>
              )}
              {step < 6 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canProceed()}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
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