// /app/components/ReservationForm.tsx
'use client';

import { useState } from 'react';
import { createReservation, checkTimeSlotAvailability } from '@/lib/firebase/reservations';

interface ReservationFormProps {
  restaurantId: string;
  availableTimes: string[];
}

export default function ReservationForm({ restaurantId, availableTimes }: ReservationFormProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Assuming you have user authentication in place
      const userId = 'current-user-id'; // Replace with actual user ID
      
      // Check availability
      const reservationsCount = await checkTimeSlotAvailability(restaurantId, date, time);
      if (reservationsCount > 5) { // Assuming 5 reservations per time slot max
        setError('This time slot is fully booked. Please select another time.');
        setLoading(false);
        return;
      }
      
      const reservationId = await createReservation({
        restaurantId,
        userId,
        date,
        time,
        numberOfGuests: guests,
        status: 'pending'
      });
      
      setSuccess(true);
      // Reset form
      setDate('');
      setTime('');
      setGuests(2);
    } catch (err) {
      setError('Failed to create reservation. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-xl font-bold mb-4">Make a Reservation</h3>
      
      {success && (
        <div className="bg-green-100 p-3 rounded mb-4">
          Reservation created successfully!
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Time</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select a time</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Number of Guests</label>
          <input
            type="number"
            min="1"
            max="10"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          {loading ? 'Processing...' : 'Reserve'}
        </button>
      </form>
    </div>
  );
}