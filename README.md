# Budget Simulator

A modern web application that helps users explore and compare rent costs across different US cities using an interactive map interface. Built with Next.js, React, and Mapbox GL.

## Features

- Interactive US map with city selection
- Real-time rent estimates using Zillow API
- Beautiful, responsive UI with smooth animations
- City-specific rent information cards
- Caching system for rent data to improve performance
- Modern gradient-based design with smooth transitions
- User authentication with Google OAuth
- Save and manage favorite cities
- **Redesigned navigation bar:**
  - Glassmorphism style, sticky, and responsive
  - Navigation links and app name grouped and left-aligned
  - Auth buttons right-aligned
  - NavBar is hidden on `/rent-map` for a fullscreen map experience

## Tech Stack

- **Frontend Framework**: Next.js 15.3.2
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL & react-map-gl
- **Animations**: Framer Motion
- **API Integration**: Axios
- **Language**: TypeScript
- **Database & Auth**: Supabase (PostgreSQL)

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- A Mapbox access token
- A RapidAPI Zillow API key
- A Supabase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/budget-simulator.git
cd budget-simulator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your API keys:
```
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
RAPIDAPI_ZILLOW_KEY=your_zillow_api_key
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── rent-map/       # Rent map page
│   ├── dashboard/      # User dashboard
│   └── layout.tsx      # Root layout
├── components/         # React components
│   ├── USMap.tsx      # Interactive US map
│   ├── CityCard.tsx   # City information card
│   ├── NavBar.tsx     # Navigation bar (redesigned, grouped left)
│   └── NavBarWrapper.tsx # Client component for conditional NavBar rendering
├── lib/               # Utility functions
│   ├── supabaseClient.ts
│   └── supabaseServer.ts
└── data/             # Static data
```

### NavBar & Layout Notes
- The navigation bar uses a glassmorphism style and is sticky at the top.
- The app name and navigation links are grouped and left-aligned for a clean look.
- Auth buttons are right-aligned.
- The NavBar is **not shown on `/rent-map`** to allow a fullscreen map view.
- Conditional rendering is handled by a client component: `components/NavBarWrapper.tsx`.

## Enable Google Auth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to Authentication → Providers
3. Enable Google provider
4. In Google Cloud Console:
   - Create a new project or select existing one
   - Go to APIs & Services → Credentials
   - Create OAuth 2.0 Client ID (Web application)
   - Add authorized redirect URIs:
     ```
     https://<project-ref>.supabase.co/auth/v1/callback
     http://localhost:3000/auth/v1/callback
     ```
5. Copy the Client ID and Client Secret
6. Paste them back into Supabase Google provider settings
7. Save changes

## API Integration

The application uses the Zillow API through RapidAPI to fetch real-time rent estimates for different cities. The API endpoint is configured to handle city-specific queries and return median rent data.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Mapbox for the mapping functionality
- Zillow for the rent data API
- Supabase for database and authentication
- Next.js team for the amazing framework
