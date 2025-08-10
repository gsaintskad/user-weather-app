// app/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import UserCard from '@/components/UserCard';
import WeatherModal from '@/components/WeatherModal';
import { Button } from '@/components/ui/button';
import { User, Weather, UserWithWeather } from '@/types';

// Helper function to fetch weather via our own API
const fetchWeatherForUser = async (user: User): Promise<UserWithWeather> => {
  const { latitude, longitude } = user.location.coordinates;
  const weatherRes = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
  if (!weatherRes.ok) return { user, weather: null };
  const weatherData: Weather = await weatherRes.json();
  return { user, weather: weatherData };
};

export default function HomePage() {
  const [users, setUsers] = useState<UserWithWeather[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchNewUsers = useCallback(async (count: number = 5, existingUsers: UserWithWeather[] = []) => {
    setLoading(true);
    try {
      const userRes = await fetch(`/api/users?count=${count}`);
      const { results: userResults } = await userRes.json();
      
      const combinedUsers = [...existingUsers, ...users];
      const newUsers = userResults.filter(
        (newUser: User) => !combinedUsers.some(existing => existing.user.id.value === newUser.id.value)
      );

      if (newUsers.length === 0) {
        setLoading(false);
        setInitialLoad(false);
        return;
      }
      
      const usersWithWeather = await Promise.all(newUsers.map(fetchWeatherForUser));
      setUsers((prevUsers) => [...prevUsers, ...usersWithWeather]);

    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [users]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const loadInitialData = async () => {
      setInitialLoad(true);
      setLoading(true);

      let localUsersWithWeather: UserWithWeather[] = [];
      const savedUsersRaw = localStorage.getItem('savedUsers');
      
      if (savedUsersRaw) {
        const savedUsers: User[] = JSON.parse(savedUsersRaw);
        
        if (savedUsers.length > 0) {
          localUsersWithWeather = await Promise.all(savedUsers.map(fetchWeatherForUser));
          setUsers(localUsersWithWeather);

          // This is the new conditional logic
          if (savedUsers.length > 5) {
            setLoading(false);
            setInitialLoad(false);
            return; // Stop here and don't fetch new users
          }
        }
      }
      
      // This line will only be reached if localStorage has 5 or fewer users
      await fetchNewUsers(5, localUsersWithWeather);
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const handleSaveUser = (userToSave: User) => {
    const savedUsers = JSON.parse(localStorage.getItem('savedUsers') || '[]');
    if (!savedUsers.some((u: User) => u.id.value === userToSave.id.value)) {
      const newSavedUsers = [...savedUsers, userToSave];
      localStorage.setItem('savedUsers', JSON.stringify(newSavedUsers));
      alert(`${userToSave.name.first} has been saved!`);
    } else {
      alert(`${userToSave.name.first} is already saved.`);
    }
  };

  const handleShowWeather = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const selectedUserWeather = users.find(u => u.user.id.value === selectedUser?.id.value)?.weather || null;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-slate-900">
          User & Weather Dashboard
        </h1>
        {initialLoad && <p className="text-center text-slate-500">Loading your users...</p>}
        <div className="space-y-4">
          {users.map(({ user, weather }) => (
            <UserCard
              key={user.id.value || user.email}
              user={user}
              weather={weather}
              onSave={handleSaveUser}
              onShowWeather={handleShowWeather}
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button onClick={() => fetchNewUsers(5)} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      </div>
      <WeatherModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
        weather={selectedUserWeather}
      />
    </main>
  );
}