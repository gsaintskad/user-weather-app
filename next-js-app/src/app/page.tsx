// app/page.tsx

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import UserCard from '@/components/UserCard';
import WeatherModal from '@/components/WeatherModal';
import { Button } from '@/components/ui/button';
import { User, Weather, UserWithWeather } from '@/types';
import { toast } from 'sonner'; // Import the toast function

// Helper function to fetch weather via our own API
const fetchWeatherForUser = async (user: User): Promise<UserWithWeather> => {
  const { latitude, longitude } = user.location.coordinates;
  const url = `/api/weather?lat=${latitude}&lon=${longitude}`;

  const attemptFetch = async () => {
    const weatherRes = await fetch(url);
    if (!weatherRes.ok) {
      throw new Error(`Failed to fetch weather. Status: ${weatherRes.status}`);
    }
    return weatherRes.json();
  };

  try {
    const weatherData: Weather = await attemptFetch();
    return { user, weather: weatherData };
  } catch (error) {
    console.log(`First attempt to fetch weather for ${user.name.first} failed. Retrying...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const weatherData: Weather = await attemptFetch();
      console.log(`Successfully fetched weather for ${user.name.first} on second attempt.`);
      return { user, weather: weatherData };
    } catch (finalError) {
      console.error(`Final attempt to fetch weather for ${user.name.first} failed.`, finalError);
      return { user, weather: null };
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

  // --- Optimized Handlers ---

  const handleUpdateWeather = useCallback(async (userToUpdate: User) => {
    const { user, weather } = await fetchWeatherForUser(userToUpdate);
    if (weather) {
      setUsers(currentUsers =>
        currentUsers.map(u =>
          u.user.id.value === user.id.value ? { ...u, weather } : u
        )
      );
    }
  }, []);

  const handleSaveUser = useCallback((userToSave: User) => {
    const savedUsers = JSON.parse(localStorage.getItem('savedUsers') || '[]');
    if (!savedUsers.some((u: User) => u.id.value === userToSave.id.value)) {
      const newSavedUsers = [...savedUsers, userToSave];
      localStorage.setItem('savedUsers', JSON.stringify(newSavedUsers));
      // Use toast.success for a successful save
      toast.success(`${userToSave.name.first} has been saved!`);
    } else {
      // Use toast.info for an informational message
      toast.info(`${userToSave.name.first} is already saved.`);
    }
  }, []);

  const handleShowWeather = useCallback((user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);
  
  const handleLoadMore = useCallback(async () => {
    setLoading(true);
    try {
      const userRes = await fetch(`/api/users?count=5`);
      const { results: userResults } = await userRes.json();
      
      const potentialUsersWithWeather = await Promise.all(userResults.map(fetchWeatherForUser));

      setUsers((prevUsers) => {
        const existingUserIds = new Set(prevUsers.map(u => u.user.id.value));
        const newUsers = potentialUsersWithWeather.filter(
          (newUser) => newUser.user.id.value && !existingUserIds.has(newUser.user.id.value)
        );
        return [...prevUsers, ...newUsers];
      });

    } catch (error) {
      console.error('Failed to fetch more data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectedUserWeather = useMemo(() => 
    users.find(u => u.user.id.value === selectedUser?.id.value)?.weather || null,
    [users, selectedUser]
  );

  // Effect for initial data load, now only runs once after mount.
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const loadInitialData = async () => {
      setInitialLoad(true);
      setLoading(true);
      try {
        const savedUsersRaw = localStorage.getItem('savedUsers');
        const savedUsers: User[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];

        const shouldFetchNew = savedUsers.length < 5;
        let remoteUsers: User[] = [];

        if (shouldFetchNew) {
          const userRes = await fetch(`/api/users?count=5`);
          const { results } = await userRes.json();
          remoteUsers = results;
        }

        const allUsers = [...savedUsers, ...remoteUsers];
        const uniqueUserMap = new Map<string, User>();
        allUsers.forEach(user => {
          if (user?.id?.value) {
            uniqueUserMap.set(user.id.value, user);
          }
        });
        const uniqueUsers = Array.from(uniqueUserMap.values());
        
        const usersWithWeather = await Promise.all(uniqueUsers.map(fetchWeatherForUser));
        setUsers(usersWithWeather);

      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    loadInitialData();
  }, [isMounted]);

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
              onUpdateWeather={handleUpdateWeather}
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button onClick={handleLoadMore} disabled={loading}>
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
