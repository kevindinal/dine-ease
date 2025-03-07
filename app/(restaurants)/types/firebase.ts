// /app/types/restaurant.ts
// export interface Restaurant {
//     id: string;
//     name: string;
//     description: string;
//     cuisine: string[];
//     priceRange: string;
//     rating: number;
//     reviewCount: number;
//     reviews: number;
//     category: string;
//     featuredMenu: MenuItem[];
//     photos: string[];
//     availableTimes: string[];
//     address: string;
//     about: string;
//     createdAt: Date;
//     updatedAt: Date;
//     location: string;
    // location: {
    //   toLowerCase(): unknown;
    //   address: string;
    //   coordinates: {
    //     latitude: number;
    //     longitude: number;
    //   };
    // };
  //   image: string[];
  //   bannerImage: string;
  //   availability: {
  //     [date: string]: string[];
  //   };
  // }
  

// types/firebase.ts

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  image: string;
  bannerImage: string;
  rating: number;
  reviews: number;
  cuisine: string[];
  category: string;
  priceRange: string;
  location: string;
  featuredMenu: MenuItem[];
  availability: {
    [date: string]: string[];
  };
  photos: string[];
  availableTimes: string[];
  address: string;
  description: string;
  about: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  image: string;
  description?: string;
  category?: string;
  restaurantId: string;
}

// Reservation Types
export interface Reservation {
  id: string;
  restaurantId: string;
  userId: string;
  date: string;
  time: string;
  numberOfGuests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Review Types
export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  rating: number;
  text: string;
  customerName: string;
  date: Date;
  verified: boolean;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  favoriteRestaurants?: string[];
  reservationHistory?: string[];
}

