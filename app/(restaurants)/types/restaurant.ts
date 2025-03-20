// types/restaurant.ts

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  address: string;
  image: string;
  about: string;
  category: string;
  cuisine: string[];
  description: string;
  featuredMenu: MenuItem[];
  photos: string[];
  priceRange: string;
  rating: number;
  reviews: Review[];
  times: string[];
  bannerImage: string;
}

export interface MenuItem {
  name: string;
  image: string;
  price: number;
}

export interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  date: Date;
}