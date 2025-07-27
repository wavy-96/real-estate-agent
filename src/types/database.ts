export interface Broker {
  id: string
  name: string
  years_of_experience: number
  area_of_service: string
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  name: string
  phone: string
  email: string
  broker_id: string
  rent_or_buy: 'rent' | 'buy'
  budget_min: number
  budget_max: number
  bedrooms: number
  bathrooms: number
  location: string
  amenities: string[]
  created_at: string
  updated_at: string
}

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
  location: string
  amenities: string[]
  images: string[]
  broker_id: string
  client_id?: string
  shown_to_client: boolean
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  broker_id: string
  client_id: string
  message: string
  sender: 'broker' | 'client'
  created_at: string
} 