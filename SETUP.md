# 🚀 Quick Setup Guide

## 🔑 **API Keys Setup**

Create a `.env.local` file in your project root with these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Site URL (for OTP redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📍 **Where to Get Your Keys:**

### **Supabase Keys:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy the URL and keys

### **OpenAI Key:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account and get your API key

### **Site URL:**
- Set to your deployment URL (e.g., `https://your-app.vercel.app`)
- For local development, use `http://localhost:3000`

## 🎯 **Demo Features:**

### **AI-Powered Real Estate Agent:**
- **OpenAI GPT-4o integration** for intelligent property assistance
- **Property search tools** based on client preferences
- **Market analysis** with real-time insights
- **Property comparison** and investment analysis
- **Natural language chat** for all real estate queries

### **Reset Demo Button:**
- Click "Reset Demo" on the landing page
- Clears all stored data
- Returns to onboarding screen
- Perfect for multiple demos!

### **Video Loop:**
- Video now loops continuously
- Enhanced with manual reset on end
- Should play automatically

## 🚀 **Quick Start:**

1. **Add your API keys** to `.env.local`
2. **Run the app**: `npm run dev`
3. **Demo to multiple people** using the Reset Demo button
4. **Video should loop** automatically in the background

## 📱 **Demo Flow:**
1. Broker onboarding (name, experience, area)
2. Landing page with video background
3. Chat options (AI Assistant, existing/new client)
4. **AI Chat Interface** with OpenAI-powered assistance
5. New client onboarding (6 steps)
6. Existing client dashboard
7. **Reset Demo** to start over!

Perfect for quick demos to multiple stakeholders! 🎉 