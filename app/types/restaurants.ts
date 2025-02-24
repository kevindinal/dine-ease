// /app/types/restaurant.ts
export interface Restaurant {
    id: string;
    name: string;
    description: string;
    cuisine: string[];
    priceRange: string;
    rating: number;
    reviewCount: number;
    location: {
      address: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    images: string[];
    availability: {
      [date: string]: string[];
    };
  }
  
  export interface Reservation {
    id: string;
    restaurantId: string;
    userId: string;
    date: string;
    time: string;
    numberOfGuests: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: Date;
  }