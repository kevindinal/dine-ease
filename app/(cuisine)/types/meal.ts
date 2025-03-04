export interface Meal {
    id: string;
    restaurantId: string;
    categoryId: string;
    name: string;
    price: number;
    rating: number;
    description: string;
    longDescription: string;
    image: string;
    carouselImages: string[];
    isTodaysSpecial: boolean;
    isChefsSpecial: boolean;
  }