// components/WeatherModal.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Weather, User } from '@/types';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: Weather | null;
  user: User | null;
}

const getWeatherIcon = (code: number) => {
  if (code === 0) return '☀️';
  if (code > 0 && code < 4) return '☁️';
  if ((code > 50 && code < 66) || (code > 79 && code < 83)) return '🌧️';
  return '☀️';
};

export default function WeatherModal({ isOpen, onClose, weather, user }: WeatherModalProps) {
  // Only check for the essential props to render the modal shell
  if (!isOpen || !user) {
    return null;
  }

  // Check for complete weather data *inside* the component
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
          // If we have data, show it
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="text-6xl">{getWeatherIcon(weather.current_weather.weathercode)}</div>
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
          // Otherwise, show a helpful message
          <div className="py-8 text-center text-gray-500">
            <p>Weather data is currently unavailable for this user.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}