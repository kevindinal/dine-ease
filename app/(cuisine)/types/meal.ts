export interface Meal {
    id: string;
    name: string;
    price: number;
    rating: number;
    description: string;
    longDescription: string;
    imageUrl: string;
    imageCarousal: string[];
    isTodaysSpecial: boolean;
    isChefsSpecial: boolean;
  }