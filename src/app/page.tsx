// app/page.tsx

import UserCard from '@/components/UserCard';
import { mockUser, mockWeather } from './mock-data';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
          User Information
        </h1>
        <div className="space-y-6">
          {/* We'll map over real data here later */}
          <UserCard user={mockUser} weather={mockWeather} />
          {/* Adding another card for demonstration purposes */}
          <UserCard user={{...mockUser, name: {first: 'Jane', last: 'Doe'}, gender: 'female', email: 'jane.doe@example.com', picture: {large: 'https://randomuser.me/api/portraits/women/1.jpg'}}} weather={{...mockWeather, current_weather: {...mockWeather.current_weather, temperature: 18.1}}} />
        </div>
        <div className="mt-8 text-center">
          <button className="rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white transition-transform hover:scale-105">
            Load More
          </button>
        </div>
      </div>
    </main>
  );
}