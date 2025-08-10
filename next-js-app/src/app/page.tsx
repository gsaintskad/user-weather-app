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
  const url = `/api/weather?lat=${latitude}&lon=${longitude}`;

  const attemptFetch = async () => {
    const weatherRes = await fetch(url);
    if (!weatherRes.ok) {
      // If it fails, throw an error to trigger the retry
      throw new Error(`Failed to fetch weather. Status: ${weatherRes.status}`);
    }
    return weatherRes.json();
  };

  try {
    const weatherData: Weather = await attemptFetch();
    return { user, weather: weatherData };
  } catch (error) {
    console.log(`First attempt to fetch weather for ${user.name.first} failed. Retrying...`);
    // Wait for a second before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const weatherData: Weather = await attemptFetch();
      console.log(`Successfully fetched weather for ${user.name.first} on second attempt.`);
      return { user, weather: weatherData };
    } catch (finalError) {
      console.error(`Final attempt to fetch weather for ${user.name.first} failed.`, finalError);
      return { user, weather: null }; // Return null after the final failure
    }
  }
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
  const handleUpdateWeather = async (userToUpdate: User) => {
    const { user, weather } = await fetchWeatherForUser(userToUpdate);
    if (weather) {
      setUsers(currentUsers =>
        currentUsers.map(u =>
          u.user.id.value === user.id.value ? { ...u, weather: weather } : u
        )
      );
    }
  };
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
              onUpdateWeather={handleUpdateWeather} // Pass the new handler down
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