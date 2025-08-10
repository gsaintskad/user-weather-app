// components/UserCard.tsx

'use client';

import { User, Weather } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';

interface UserCardProps {
  user: User;
  weather: Weather | null;
  onSave: (user: User) => void;
  onShowWeather: (user: User) => void;
  onUpdateWeather: (user: User) => void;
}

// The weather icon logic is updated to check temperature first
const getWeatherIcon = (code: number, temp: number) => {
  if (temp <= 0) return '❄️'; // Show snowflake for freezing or below
  if (code === 0) return '☀️';
  if (code > 0 && code < 4) return '☁️';
  if ((code > 50 && code < 66) || (code > 79 && code < 83)) return '🌧️';
  return '☀️';
};

export default function UserCard({ user, weather, onSave, onShowWeather, onUpdateWeather }: UserCardProps) {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(`Updating weather for ${user.name.first}...`);
      onUpdateWeather(user);
    }, 300000);

    return () => clearInterval(interval);
  }, [user, onUpdateWeather]);

  return (
    <Card className="transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        {/* --- New CSS Grid Layout --- */}
        <div className="grid grid-cols-2 items-center gap-x-4">
          {/* Row 1, Column 1: Avatar */}
          <Image
            src={user.picture.large}
            alt={`${user.name.first} ${user.name.last}`}
            width={80}
            height={80}
            className="rounded-full border-4 border-slate-200"
          />

          {/* Row 1, Column 2: Weather Info */}
          {weather && weather.current_weather && (
            <div className="text-right justify-self-end">
              <p className="text-3xl">
                {/* The temperature is now passed to the icon function */}
                {getWeatherIcon(weather.current_weather.weathercode, weather.current_weather.temperature)}
              </p>
              <p className="text-lg font-semibold text-slate-800">
                {weather.current_weather.temperature}°C
              </p>
            </div>
          )}

          {/* Row 2, Spanning both columns: User Details */}
          <div className="col-span-2 mt-4">
            <CardTitle className="text-xl">
              {user.name.first} {user.name.last}
            </CardTitle>
            <p className="text-sm capitalize text-slate-500">{user.gender}</p>
            {/* Using break-words for better text wrapping on emails */}
            <p className="text-sm text-slate-600 break-words">{user.email}</p>
            <p className="text-sm text-slate-600">
              {user.location.city}, {user.location.country}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onShowWeather(user)}>
          Weather
        </Button>
        <Button onClick={() => onSave(user)}>Save</Button>
      </CardFooter>
    </Card>
  );
}