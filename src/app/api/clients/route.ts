import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
// import { Client } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    const {
      name,
      phone,
      email,
      broker_id,
      rent_or_buy,
      budget_min,
      budget_max,
      bedrooms,
      bathrooms,
      location,
      amenities,
    } = body

    const { data, error } = await supabase
      .from('clients')
      .insert([
        {
          name,
          phone,
          email,
          broker_id,
          rent_or_buy,
          budget_min,
          budget_max,
          bedrooms,
          bathrooms,
          location,
          amenities,
        }
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const broker_id = searchParams.get('broker_id')
    const phone = searchParams.get('phone')

    let query = supabase.from('clients').select('*')

    if (id) {
      query = query.eq('id', id)
    } else if (broker_id) {
      query = query.eq('broker_id', broker_id)
    } else if (phone) {
      query = query.eq('phone', phone)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (id) {
      return NextResponse.json(data[0] || null)
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 