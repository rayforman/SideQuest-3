# SideQuest 3

A modern travel planning platform that delivers personalized adventure recommendations through a TikTok-style quest feed, powered by AI and built with Next.js, Supabase, and Stripe.

## Features

- **AI-Powered Quest Feed**: Discover travel adventures tailored to your preferences in an engaging, scrollable TikTok-style interface
- **Comprehensive Trip Planning**: Get detailed itineraries, activities, pricing, and budgets for each quest
- **User Authentication**: Secure sign-up and login with email-based authentication via Supabase
- **Favorites System**: Like and save your favorite quests for later
- **Subscription Management**: Tiered pricing plans with Stripe integration for premium features
- **Responsive Design**: Mobile-first UI built with React and Tailwind CSS
- **Dark Mode Support**: Theme switching with next-themes
- **Interactive Components**: Rich UI library using Radix UI primitives

## Tech Stack

### Frontend
- **Framework**: [Next.js 14.2](https://nextjs.org/) - React framework with App Router
- **Language**: TypeScript 5
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) with Radix UI components
- **UI Components**: Custom component library built on [Radix UI](https://www.radix-ui.com/)
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [lucide-react](https://lucide.dev/) & [@radix-ui/react-icons](https://radix-ui.com/docs/primitives/overview/icons)
- **Forms**: [react-hook-form](https://react-hook-form.com/)

### Backend & Database
- **Backend**: Next.js API routes + Supabase functions
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth with email/password
- **Real-time**: Supabase real-time capabilities

### Payments & Monetization
- **Payments**: [Stripe](https://stripe.com/) for subscription management
- **Pricing Integration**: [Polar SDK](https://polar.sh/) for alternative payment handling

### Development Tools
- **Package Manager**: npm
- **Build Tool**: Next.js
- **Code Formatting**: Prettier
- **Deployment**: (Configure webhooks with deploy-webhooks.sh)

## Project Structure

```
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── (auth)/              # Authentication routes
│   │   │   ├── sign-up/
│   │   │   ├── sign-in/
│   │   │   ├── forgot-password/
│   │   │   └── auth/
│   │   ├── dashboard/            # User dashboard
│   │   ├── quests/               # Quest pages
│   │   │   ├── search/
│   │   │   ├── liked/
│   │   │   └── onboarding/
│   │   ├── pricing/              # Pricing page
│   │   └── layout.tsx            # Root layout
│   ├── components/               # Reusable React components
│   │   ├── ui/                  # UI component library (Radix-based)
│   │   ├── hero.tsx
│   │   ├── navbar.tsx
│   │   ├── quest-card.tsx
│   │   └── ...
│   ├── lib/                      # Utility functions
│   ├── types/                    # TypeScript type definitions
│   │   ├── quest.ts
│   │   └── supabase.ts
│   ├── utils/                    # Helper utilities
│   └── middleware.ts             # Next.js middleware
├── supabase/
│   ├── functions/                # Supabase Edge Functions
│   │   ├── create-checkout/
│   │   ├── get-plans/
│   │   └── payments-webhook/
│   ├── migrations/               # Database migrations
│   └── config.toml              # Supabase config
├── components.json              # shadcn/ui configuration
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project dependencies
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rayforman/SideQuest-3.git
   cd SideQuest-3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   ```

4. **Set up Supabase locally (optional)**
   ```bash
   supabase start
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## Key Data Structures

### Quest
Represents a travel adventure with the following properties:
- `id` - Unique identifier
- `title` - Quest name
- `description` - Detailed description
- `cover_image` - Hero image URL
- `destination` - Travel destination
- `budget_level` - Budget category (e.g., budget, mid, luxury)
- `duration` - Human-readable duration (e.g., "5 days")
- `duration_days` - Numeric duration in days
- `total_price` - Total cost
- `currency` - Currency code (e.g., USD)
- `activities` - List of activities with duration and pricing
- `itinerary` - Day-by-day breakdown
- `categories` - Categorization tags

## Authentication

The application uses Supabase Auth for user management:
- Email-based registration and login
- Password reset functionality
- Session management with SSR support
- Protected routes via middleware

## Payment Integration

Stripe integration handles:
- Subscription plan creation and management
- Checkout flow via `create-checkout` function
- Webhook handling for payment events
- Plan retrieval and pricing display

## Deployment

Deployment is handled via GitHub webhooks. Use the deployment script:
```bash
./deploy-webhooks.sh
```

Configure your deployment target in the script before running.

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is proprietary and maintained by Ray Forman.

## Contact

For questions or feedback, please reach out through the project repository.
