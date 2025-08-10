// components/UserCard.tsx

'use client';

import { User, Weather } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface UserCardProps {
  user: User;
  weather: Weather | null;
  onSave: (user: User) => void;
  onShowWeather: (user: User) => void;
}

const getWeatherIcon = (code: number) => {
  if (code === 0) return '☀️';
  if (code > 0 && code < 4) return '☁️';
  if ((code > 50 && code < 66) || (code > 79 && code < 83)) return '🌧️';
  return '☀️';
};

export default function UserCard({ user, weather, onSave, onShowWeather }: UserCardProps) {
  return (
    <Card className="transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Image
            src={user.picture.large}
            alt={`${user.name.first} ${user.name.last}`}
            width={80}
            height={80}
            className="rounded-full border-4 border-slate-200"
          />
          <div className="flex-1">
            <CardTitle className="text-xl">
              {user.name.first} {user.name.last}
            </CardTitle>
            <p className="text-sm capitalize text-slate-500">{user.gender}</p>
            <p className="text-sm text-slate-600">{user.email}</p>
            <p className="text-sm text-slate-600">
              {user.location.city}, {user.location.country}
            </p>
          </div>
          {/* This is the updated line */}
          {weather && weather.current_weather && (
            <div className="text-right">
              <p className="text-3xl">{getWeatherIcon(weather.current_weather.weathercode)}</p>
              <p className="text-lg font-semibold text-slate-800">
                {weather.current_weather.temperature}°C
              </p>
            </div>
          )}
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