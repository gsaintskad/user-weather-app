// next-js-app/src/components/WeatherModal.tsx

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Weather, User } from '@/types';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: Weather | null;
  user: User | null;
}

// A helper to get a simple weather condition string
const getWeatherCondition = (code: number): string => {
  if (code === 0) return 'Sunny';
  if (code > 0 && code < 4) return 'Cloudy';
  if ((code > 50 && code < 66) || (code > 79 && code < 83)) return 'Rainy';
  return 'Clear';
};

const getWeatherIcon = (code: number, temp: number) => {
  if (temp <= 0) return '❄️';
  if (code === 0) return '☀️';
  if (code > 0 && code < 4) return '☁️';
  if ((code > 50 && code < 66) || (code > 79 && code < 83)) return '🌧️';
  return '☀️';
};

export default function WeatherModal({ isOpen, onClose, weather, user }: WeatherModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetAdvice = async () => {
    if (!weather || !weather.current_weather) {
      toast.error('Cannot get advice without weather data.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost/advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temperature: weather.current_weather.temperature,
          condition: getWeatherCondition(weather.current_weather.weathercode),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get advice from the server.');
      }

      const data = await response.json();
      toast.success(data.advice);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !user) {
    return null;
  }

  const hasCompleteWeatherData = weather && weather.current_weather && weather.daily;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Weather for {user.name.first}</DialogTitle>
          <DialogDescription>
            Current weather details in {user.location.city}.
          </DialogDescription>
        </DialogHeader>
        {hasCompleteWeatherData ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="text-6xl">
              {getWeatherIcon(weather.current_weather.weathercode, weather.current_weather.temperature)}
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{weather.current_weather.temperature}°C</p>
              <p className="text-lg text-gray-500">Current Temperature</p>
            </div>
            <div className="mt-4 flex w-full justify-around">
              <div className="text-center">
                <p className="text-2xl font-semibold">{weather.daily.temperature_2m_max[0]}°C</p>
                <p className="text-sm text-gray-500">Highest</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">{weather.daily.temperature_2m_min[0]}°C</p>
                <p className="text-sm text-gray-500">Lowest</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>Weather data is currently unavailable for this user.</p>
          </div>
        )}
        <DialogFooter>
          <Button onClick={handleGetAdvice} disabled={!hasCompleteWeatherData || isLoading}>
            {isLoading ? 'Getting Advice...' : 'Get Clothing Advice'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}