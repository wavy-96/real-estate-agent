import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
// import { Broker } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    const { name, years_of_experience, area_of_service } = body

    const { data, error } = await supabase
      .from('brokers')
      .insert([
        {
          name,
          years_of_experience,
          area_of_service,
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

    if (id) {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from('brokers')
      .select('*')

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