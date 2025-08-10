// components/UserCard.tsx

'use client';

import { User, Weather } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { useEffect, useCallback, useMemo } from 'react';

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
  // This effect sets up the periodic update for weather
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(`Updating weather for ${user.name.first}...`);
      onUpdateWeather(user);
    }, 300000);

    return () => clearInterval(interval);
  }, [user, onUpdateWeather]);

  // --- Optimizations ---

  // useMemo caches the result of getWeatherIcon so it's only recalculated when weather changes.
  const weatherIcon = useMemo(() => {
    if (!weather?.current_weather) return null;
    return getWeatherIcon(weather.current_weather.weathercode, weather.current_weather.temperature);
  }, [weather]);

  // useCallback ensures these handler functions are not recreated on every render.
  const handleShowWeatherClick = useCallback(() => {
    onShowWeather(user);
  }, [onShowWeather, user]);

  const handleSaveClick = useCallback(() => {
    onSave(user);
  }, [onSave, user]);


  return (
    <Card className="transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        {/* --- Responsive Layout --- */}
        {/* Default: grid for mobile. md:flex for medium screens and up */}
        <div className="grid grid-cols-2 items-start gap-x-4 md:flex md:gap-4">
          
          {/* Item 1: Avatar */}
          <Image
            src={user.picture.large}
            alt={`${user.name.first} ${user.name.last}`}
            width={80}
            height={80}
            className="rounded-full border-4 border-slate-200"
          />

          {/* Item 2: Weather Info (Visually last on desktop) */}
          {weather && weather.current_weather && (
            <div className="text-right justify-self-end md:order-3">
              <p className="text-3xl">
                {weatherIcon}
              </p>
              <p className="text-lg font-semibold text-slate-800">
                {weather.current_weather.temperature}°C
              </p>
            </div>
          )}

          {/* Item 3: User Details (Visually second on desktop) */}
          <div className="col-span-2 mt-4 md:order-2 md:mt-0 md:flex-1">
            <CardTitle className="text-xl">
              {user.name.first} {user.name.last}
            </CardTitle>
            <p className="text-sm capitalize text-slate-500">{user.gender}</p>
            <p className="text-sm text-slate-600 break-words">{user.email}</p>
            <p className="text-sm text-slate-600">
              {user.location.city}, {user.location.country}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleShowWeatherClick}>
          Weather
        </Button>
        <Button onClick={handleSaveClick}>Save</Button>
      </CardFooter>
    </Card>
  );
}
