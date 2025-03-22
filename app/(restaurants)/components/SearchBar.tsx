// /app/components/SearchBar.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchParams = new URLSearchParams();
    if (date) searchParams.set('date', date);
    if (time) searchParams.set('time', time);
    if (guests) searchParams.set('guests', guests);
    if (location) searchParams.set('location', location);
    
    router.push(`/restaurants?${searchParams.toString()}`);
  };

  return (
    <div className="bg-cover bg-center p-8 text-center text-white" style={{ backgroundImage: 'url("/images/restaurant-banner.jpg")' }}>
      <h1 className="text-3xl font-bold mb-4">Make a free reservation</h1>
      
      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 rounded text-black"/>
        
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="p-2 rounded text-black"/>
        
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="p-2 rounded text-black">
          {[...Array(10)].map((_, i) => (
            <option key={i+1} value={i+1}>
              {i+1} {i === 0 ? 'Guest' : 'Guests'}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Location, Restaurant, or Cuisine"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 rounded flex-grow text-black"/>
        
        <button
          type="submit"
          className="p-2 bg-red-500 rounded hover:bg-red-600">
          Let's go
        </button>
      </form>
    </div>
  );
}