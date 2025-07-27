# Deployment Guide for Vercel

This guide will help you deploy the Real Estate Agent Platform to Vercel with proper OTP configuration.

## Prerequisites

- Vercel account
- Supabase project
- OpenAI API key
- Domain (optional)

## Step 1: Prepare Your Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Site Configuration (IMPORTANT for OTP)
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app

# Twilio Configuration (optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy your project:
```bash
vercel
```

### Option B: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables (see Step 3)

## Step 3: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add the following environment variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Production, Preview, Development |
| `OPENAI_API_KEY` | Your OpenAI API key | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` | Production, Preview, Development |

## Step 4: Configure OTP for Production

### For Supabase Email OTP:

1. In your Supabase dashboard, go to "Authentication" → "Settings"
2. Under "URL Configuration", set:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/auth/callback`

3. Update your `NEXT_PUBLIC_SITE_URL` in Vercel to match your actual domain

### For Demo OTP (Development):

The app includes a demo OTP system that works without email configuration. This is automatically used when:
- `NODE_ENV` is 'development'
- Supabase configuration is not properly set

## Step 5: Database Setup

1. In your Supabase dashboard, go to "SQL Editor"
2. Run the following SQL to create the required tables:

```sql
-- Brokers table
CREATE TABLE brokers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  years_of_experience INTEGER NOT NULL,
  area_of_service TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  broker_id UUID REFERENCES brokers(id),
  rent_or_buy TEXT CHECK (rent_or_buy IN ('rent', 'buy')),
  budget_min INTEGER,
  budget_max INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  location TEXT,
  amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listings table
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  location TEXT,
  amenities TEXT[],
  images TEXT[],
  broker_id UUID REFERENCES brokers(id),
  client_id UUID REFERENCES clients(id),
  shown_to_client BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_id UUID REFERENCES brokers(id),
  client_id UUID REFERENCES clients(id),
  message TEXT NOT NULL,
  sender TEXT CHECK (sender IN ('broker', 'client')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 6: Performance Monitoring

The app includes built-in performance monitoring for the LLM:

- **Cache Hit Rate**: Tracks how often responses are served from cache
- **Response Time**: Monitors average LLM response times
- **Error Rate**: Tracks failed requests
- **Real-time Metrics**: Available in the AI chat interface

To view performance metrics:
1. Open the AI chat interface
2. Click the Activity icon in the header
3. View real-time performance data

## Step 7: Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Update `NEXT_PUBLIC_SITE_URL` to match your custom domain
4. Update Supabase redirect URLs accordingly

## Troubleshooting

### OTP Issues

**Problem**: OTP emails not being received
**Solution**: 
1. Check your Supabase email configuration
2. Verify `NEXT_PUBLIC_SITE_URL` is correct
3. Check spam folder
4. Use demo OTP for testing (check console for OTP code)

**Problem**: OTP redirect not working
**Solution**:
1. Ensure `NEXT_PUBLIC_SITE_URL` is set correctly
2. Check Supabase redirect URL configuration
3. Verify the `/auth/callback` route exists

### Performance Issues

**Problem**: Slow LLM responses
**Solution**:
1. Check OpenAI API key configuration
2. Monitor performance dashboard
3. Verify cache is working (should see cache hits)
4. Check network connectivity

### Database Issues

**Problem**: Database connection errors
**Solution**:
1. Verify Supabase URL and keys
2. Check database table structure
3. Ensure RLS policies are configured correctly

## Environment-Specific Configuration

### Development
- Uses demo OTP system
- Performance monitoring enabled
- Detailed console logging

### Production
- Uses Supabase email OTP
- Optimized for performance
- Minimal console logging

### Preview (Vercel)
- Same as production
- Uses preview environment variables

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to version control
2. **API Keys**: Rotate OpenAI and Supabase keys regularly
3. **CORS**: Configure CORS properly in Supabase
4. **Rate Limiting**: Consider implementing rate limiting for API routes

## Monitoring and Analytics

The app includes several monitoring features:

- **LLM Performance**: Real-time metrics in the chat interface
- **Error Tracking**: Automatic error logging
- **Cache Analytics**: Cache hit rate monitoring
- **Response Time Tracking**: Average response time calculation

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test OTP functionality
4. Monitor performance dashboard

For feature requests or bugs:
1. Create an issue in the GitHub repository
2. Include deployment environment details
3. Provide error logs if applicable 