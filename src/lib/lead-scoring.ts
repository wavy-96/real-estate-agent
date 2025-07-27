import { z } from 'zod'

export interface LeadScore {
  totalScore: number
  scoreBreakdown: {
    budget: number
    urgency: number
    commitment: number
    location: number
    preferences: number
  }
  qualification: 'Hot' | 'Warm' | 'Cold'
  recommendations: string[]
}

export const leadScoringSchema = z.object({
  budget_min: z.number(),
  budget_max: z.number(),
  rent_or_buy: z.enum(['rent', 'buy']),
  bedrooms: z.number(),
  bathrooms: z.number(),
  location: z.string(),
  amenities: z.array(z.string()),
})

export function calculateLeadScore(clientData: z.infer<typeof leadScoringSchema>): LeadScore {
  let totalScore = 0
  const breakdown = {
    budget: 0,
    urgency: 0,
    commitment: 0,
    location: 0,
    preferences: 0,
  }
  const recommendations: string[] = []

  // Budget Scoring (0-25 points)
  const budgetRange = clientData.budget_max - clientData.budget_min
  const avgBudget = (clientData.budget_max + clientData.budget_min) / 2
  
  if (avgBudget >= 500000) {
    breakdown.budget = 25
  } else if (avgBudget >= 300000) {
    breakdown.budget = 20
  } else if (avgBudget >= 200000) {
    breakdown.budget = 15
  } else if (avgBudget >= 100000) {
    breakdown.budget = 10
  } else {
    breakdown.budget = 5
  }

  // Budget range analysis
  if (budgetRange <= 50000) {
    breakdown.budget += 5 // Clear budget
  } else if (budgetRange <= 100000) {
    breakdown.budget += 3 // Reasonable range
  } else {
    breakdown.budget += 1 // Wide range
  }

  // Urgency Scoring (0-20 points)
  if (clientData.rent_or_buy === 'buy') {
    breakdown.urgency = 20 // Buying shows more urgency
  } else {
    breakdown.urgency = 10 // Renting shows less urgency
  }

  // Commitment Scoring (0-20 points)
  const amenityCount = clientData.amenities.length
  if (amenityCount >= 5) {
    breakdown.commitment = 20 // Very specific requirements
  } else if (amenityCount >= 3) {
    breakdown.commitment = 15 // Some specific requirements
  } else if (amenityCount >= 1) {
    breakdown.commitment = 10 // Basic requirements
  } else {
    breakdown.commitment = 5 // No specific requirements
  }

  // Location Scoring (0-20 points)
  const location = clientData.location.toLowerCase()
  if (location.includes('downtown') || location.includes('city center')) {
    breakdown.location = 20 // Premium location
  } else if (location.includes('suburb') || location.includes('neighborhood')) {
    breakdown.location = 15 // Good location
  } else if (location.includes('area') || location.includes('district')) {
    breakdown.location = 10 // General area
  } else {
    breakdown.location = 5 // Vague location
  }

  // Preferences Scoring (0-15 points)
  if (clientData.bedrooms >= 3 && clientData.bathrooms >= 2) {
    breakdown.preferences = 15 // Family home
  } else if (clientData.bedrooms >= 2 && clientData.bathrooms >= 1) {
    breakdown.preferences = 12 // Good size
  } else if (clientData.bedrooms >= 1 && clientData.bathrooms >= 1) {
    breakdown.preferences = 8 // Basic requirements
  } else {
    breakdown.preferences = 5 // Minimal requirements
  }

  // Calculate total score
  totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0)

  // Determine qualification
  let qualification: 'Hot' | 'Warm' | 'Cold'
  if (totalScore >= 80) {
    qualification = 'Hot'
    recommendations.push('High priority lead - follow up within 24 hours')
    recommendations.push('Schedule property viewings immediately')
  } else if (totalScore >= 60) {
    qualification = 'Warm'
    recommendations.push('Good potential - follow up within 48 hours')
    recommendations.push('Send personalized property recommendations')
  } else {
    qualification = 'Cold'
    recommendations.push('Low priority - nurture with content marketing')
    recommendations.push('Focus on building relationship over time')
  }

  // Additional recommendations based on score breakdown
  if (breakdown.budget < 15) {
    recommendations.push('Consider showing properties in lower price ranges')
  }
  if (breakdown.urgency < 15) {
    recommendations.push('Focus on relationship building before pushing for decisions')
  }
  if (breakdown.location < 10) {
    recommendations.push('Help clarify location preferences with market overview')
  }

  return {
    totalScore,
    scoreBreakdown: breakdown,
    qualification,
    recommendations,
  }
} 