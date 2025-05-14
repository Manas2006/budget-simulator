import axios from 'axios';

interface RentEstimateResponse {
  medianRent: number;
  lastUpdated: string;
}

export async function fetchRentEstimate(city: string): Promise<RentEstimateResponse | null> {
  try {
    // Use a more reliable address format that matches the working example
    const dummyAddress = `Houston, TX`;
    
    const options = {
      method: 'GET',
      url: 'https://zillow-com1.p.rapidapi.com/rentEstimate',
      params: {
        address: dummyAddress,
        d: '0.5',
        propertyType: 'SingleFamily'
      },
      headers: {
        'x-rapidapi-key': '20d0623283msh0c1e85ce4bfaa49p119d1ajsnb68eb6dbdd24',
        'x-rapidapi-host': 'zillow-com1.p.rapidapi.com'
      }
    };

    console.log('Making API request for city:', city);
    console.log('Full request options:', JSON.stringify(options, null, 2));

    const response = await axios.request(options);
    console.log('Raw API Response:', JSON.stringify(response.data, null, 2));

    // Check if we have valid data in the response
    if (!response.data || typeof response.data !== 'object') {
      console.error('Invalid response format:', response.data);
      return null;
    }

    // Extract the rent data - adjust these fields based on the actual API response
    const rentData = response.data;
    const medianRent = rentData.medianRent || rentData.rent || rentData.price || rentData.median || 0;

    console.log('Extracted median rent:', medianRent);

    return {
      medianRent: medianRent,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });

      if (error.response?.status === 401) {
        console.error('Authentication failed. Please check your RapidAPI key.');
      } else if (error.response?.status === 429) {
        console.error('Rate limit exceeded. Please try again later.');
      } else {
        console.error('API Error:', error.response?.data || error.message);
      }
    } else {
      console.error('Error fetching rent estimate:', error);
    }
    return null;
  }
} 