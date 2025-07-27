import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Demo OTP storage for development/testing
const demoOTPs = new Map<string, { otp: string, expires: number }>()

// Helper function to get the correct site URL for OTP redirects
function getSiteUrl(): string {
  // In production, use the environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  
  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  
  // Fallback for Vercel deployment - try to construct from headers
  return 'https://your-app.vercel.app' // Replace with your actual domain
}

// Generate a demo OTP for development
function generateDemoOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if we're in development mode or if Supabase is not configured
    const isDevelopment = process.env.NODE_ENV === 'development'
    const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                              process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'

    if (isDevelopment || !hasSupabaseConfig) {
      // Use demo OTP for development
      const demoOTP = generateDemoOTP()
      const expires = Date.now() + 10 * 60 * 1000 // 10 minutes
      
      demoOTPs.set(email, { otp: demoOTP, expires })
      
      console.log(`Demo OTP for ${email}: ${demoOTP}`)
      
      return NextResponse.json({
        success: true,
        message: 'Demo OTP sent (check console for code)',
        demoOTP: demoOTP, // Only include in development
        isDemo: true
      })
    }

    // Production: Use Supabase OTP
    const siteUrl = getSiteUrl()
    console.log('Using site URL for OTP redirect:', siteUrl)

    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
        shouldCreateUser: true,
        data: {
          email: email,
        }
      }
    })

    if (error) {
      console.error('Supabase OTP error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email',
      redirectUrl: `${siteUrl}/auth/callback`,
      isDemo: false
    })
  } catch (error) {
    console.error('OTP generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = body

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Check if we're in development mode or if Supabase is not configured
    const isDevelopment = process.env.NODE_ENV === 'development'
    const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                              process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'

    if (isDevelopment || !hasSupabaseConfig) {
      // Verify demo OTP
      const demoOTPData = demoOTPs.get(email)
      
      if (!demoOTPData) {
        return NextResponse.json(
          { error: 'OTP not found or expired' },
          { status: 400 }
        )
      }

      if (Date.now() > demoOTPData.expires) {
        demoOTPs.delete(email)
        return NextResponse.json(
          { error: 'OTP expired' },
          { status: 400 }
        )
      }

      if (demoOTPData.otp !== otp) {
        return NextResponse.json(
          { error: 'Invalid OTP' },
          { status: 400 }
        )
      }

      // Clean up the OTP
      demoOTPs.delete(email)

      return NextResponse.json({
        success: true,
        message: 'Demo OTP verified successfully',
        user: { email },
        isDemo: true
      })
    }

    // Production: Verify with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: 'email'
    })

    if (error) {
      console.error('OTP verification error:', error)
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      user: data.user,
      isDemo: false
    })
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 