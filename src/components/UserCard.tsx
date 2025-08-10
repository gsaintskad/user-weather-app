// components/UserCard.tsx

import { User, Weather } from '@/types';
import Image from 'next/image';

interface UserCardProps {
  user: User;
  weather: Weather | null;
}

// A helper to get the weather icon based on the weather code from the API
const getWeatherIcon = (code: number) => {
  if (code === 0) return '☀️'; // Sunny
  if (code > 0 && code < 4) return '☁️'; // Cloudy
  if ((code > 50 && code < 66) || (code > 79 && code < 83)) return '🌧️'; // Rainy
  return '☀️'; // Default
};

export default function UserCard({ user, weather }: UserCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-xl">
      <div className="flex items-start gap-6">
        <Image
          src={user.picture.large}
          alt={`${user.name.first} ${user.name.last}`}
          width={96}
          height={96}
          className="rounded-full border-4 border-gray-200"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">
            {user.name.first} {user.name.last}
          </h2>
          <p className="text-md capitalize text-gray-500">{user.gender}</p>
          <p className="text-md mt-2 text-gray-600">{user.email}</p>
          <p className="text-md text-gray-600">
            {user.location.city}, {user.location.country}
          </p>
        </div>
        {weather && (
          <div className="text-right">
            <p className="text-4xl">{getWeatherIcon(weather.current_weather.weathercode)}</p>
            <p className="text-xl font-semibold text-gray-800">
              {weather.current_weather.temperature}°C
            </p>
            <p className="text-sm text-gray-500">
              H: {weather.daily.temperature_2m_max[0]}° L: {weather.daily.temperature_2m_min[0]}°
            </p>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <button className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600">
          Weather
        </button>
        <button className="rounded-md bg-green-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-600">
          Save
        </button>
      </div>
    </div>
  );
}