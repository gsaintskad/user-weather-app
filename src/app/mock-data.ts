// app/mock-data.ts

import { User, Weather } from '@/types';

export const mockUser: User = {
  id: { value: '302-43-4557' },
  name: { first: 'Marion', last: 'Campbell' },
  gender: 'male',
  location: {
    street: { number: 2303, name: 'Thornridge Cir' },
    city: 'Saginaw',
    state: 'Rhode Island',
    country: 'United States',
    postcode: 99698,
    coordinates: { latitude: '84.1466', longitude: '-72.8026' },
  },
  email: 'marion.campbell@example.com',
  picture: { large: 'https://randomuser.me/api/portraits/men/0.jpg' },
};

export const mockWeather: Weather = {
  current_weather: {
    temperature: 15.3,
    weathercode: 3, // Partly cloudy
  },
  daily: {
    temperature_2m_max: [18.5],
    temperature_2m_min: [10.2],
  },
};