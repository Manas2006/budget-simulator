# Budget Simulator

A modern web application that helps users explore and compare rent costs across different US cities using an interactive map interface. Built with Next.js, React, and Mapbox GL.

## Features

- Interactive US map with city selection
- Real-time rent estimates using Zillow API
- Beautiful, responsive UI with smooth animations
- City-specific rent information cards
- Caching system for rent data to improve performance
- Modern gradient-based design with smooth transitions

## Tech Stack

- **Frontend Framework**: Next.js 15.3.2
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL & react-map-gl
- **Animations**: Framer Motion
- **API Integration**: Axios
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- A Mapbox access token
- A RapidAPI Zillow API key

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
│   └── layout.tsx      # Root layout
├── components/         # React components
│   ├── USMap.tsx      # Interactive US map
│   └── CityPopupCard.tsx # City information card
├── lib/               # Utility functions
└── data/             # Static data
```

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
- Next.js team for the amazing framework
