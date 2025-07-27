# Real Estate Agent Platform

A modern, mobile-first real estate platform built for brokers to provide personalized service to their clients. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

### For Real Estate Brokers
- **Personalized Onboarding**: Collect broker information (name, experience, service area)
- **Custom Landing Page**: Video hero section with personalized greeting
- **Client Management**: Handle both new and existing clients
- **Modern UI**: Beautiful, responsive design with smooth animations

### For Clients
- **New Client Onboarding**: Comprehensive 6-step onboarding process
- **Phone Verification**: OTP verification via Twilio
- **Preference Collection**: Budget, location, property type, amenities
- **Existing Client Dashboard**: View saved listings, chat history, and profile

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **SMS**: Twilio (for OTP)
- **AI**: OpenAI (for future chat features)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Twilio account (for SMS)
- OpenAI API key (for future features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-estate-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here

   # Twilio Configuration (for OTP verification)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
   TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
   TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
   ```

4. **Set up Supabase Database**

   Create the following tables in your Supabase database:

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

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── brokers/       # Broker management
│   │   ├── clients/       # Client management
│   │   └── otp/          # OTP verification
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── BrokerOnboarding.tsx
│   ├── LandingPage.tsx
│   ├── ChatInterface.tsx
│   ├── NewClientOnboarding.tsx
│   └── ExistingClientView.tsx
├── lib/                   # Utility libraries
│   └── supabase.ts       # Supabase client configuration
└── types/                 # TypeScript type definitions
    └── database.ts        # Database schema types
```

## User Flow

1. **Broker Onboarding**: New brokers complete a 3-step onboarding process
2. **Landing Page**: Personalized landing page with video background
3. **Chat Options**: Choose between existing or new client
4. **New Client**: 6-step onboarding with phone verification
5. **Existing Client**: Dashboard with saved listings and chat history

## Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy your app

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | No |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | Yes |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | Yes |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@realestateplatform.com or create an issue in this repository.

## Roadmap

- [ ] Real-time chat with OpenAI integration
- [ ] Property search and filtering
- [ ] Virtual tour integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Payment integration
- [ ] Document management
- [ ] Email notifications
- [ ] Advanced reporting
