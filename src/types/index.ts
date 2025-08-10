// types/index.ts

export interface User {
  id: {
    value: string;
  };
  name: {
    first: string;
    last: string;
  };
  gender: string;
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: number;
    coordinates: {
      latitude: string;
      longitude: string;
    };
  };
  email: string;
  picture: {
    large: string;
  };
}

export interface Weather {
  current_weather: {
    temperature: number;
    weathercode: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export interface UserWithWeather {
  user: User;
  weather: Weather | null;
}