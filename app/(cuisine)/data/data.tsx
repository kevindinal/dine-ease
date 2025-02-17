export interface Special {
  id: number;
  image: string;
  rating: number; // Changed from string to number
  name: string;
  description: string;
  price: number;
  type: "Recommended" | "Chef's Special" | "Today's Special";
  default: "All";
  carouselImages: string[];
  category: string;
}

interface Category {
  imageSrc: string;
  foodType: string;
}

export const categories: Category[] = [
  { imageSrc: "/placeholder.jpeg", foodType: "Indian" },
  { imageSrc: "/placeholder.jpeg", foodType: "Mongolian" },
  { imageSrc: "/placeholder.jpeg", foodType: "Chinese" },
  { imageSrc: "/placeholder.jpeg", foodType: "Sri Lankan" },
];

export const recommendedForYou: Special[] = [
  {
    id: 1,
    image: "/placeholder.jpeg",
    carouselImages: [
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/hilton.png",
    ],
    rating: 4.8, // Changed to a number
    name: "Butter Chicken",
    description: "Rich and creamy tomato-based curry with grilled chicken.",
    price: 15.99,
    default: "All",
    type: "Recommended",
    category: "Indian",
  },
  {
    id: 2,
    image: "/placeholder.jpeg",
    carouselImages: [
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/hilton.png",
    ],
    rating: 4.6, // Changed to a number
    name: "Kung Pao Chicken",
    description: "Spicy stir-fried Chinese chicken dish with peanuts.",
    price: 13.99,
    default: "All",
    type: "Recommended",
    category: "Chinese",
  },
  {
    id: 3,
    image: "/placeholder.jpeg",
    carouselImages: [
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/hilton.png",
    ],
    rating: 4.7, // Changed to a number
    name: "Mongolian Beef",
    description: "Tender beef stir-fried with scallions and soy sauce.",
    price: 18.99,
    default: "All",
    type: "Recommended",
    category: "Mongolian",
  },
];

export const chefsSpecials: Special[] = [
  {
    id: 4,
    image: "/placeholder.jpeg",
    carouselImages: [
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/hilton.png",
    ],
    rating: 4.9, // Changed to a number
    name: "Tandoori Chicken",
    description: "Grilled Indian chicken marinated in yogurt and spices.",
    price: 16.99,
    default: "All",
    type: "Chef's Special",
    category: "Indian",
  },
  {
    id: 5,
    image: "/placeholder.jpeg",
    carouselImages: [
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/hilton.png",
    ],
    rating: 4.5, // Changed to a number
    name: "Dim Sum",
    description: "Traditional Chinese dumplings served with soy sauce.",
    price: 12.99,
    default: "All",
    type: "Chef's Special",
    category: "Chinese",
  },
  {
    id: 13,
    image: "/placeholder.jpeg",
    carouselImages: [
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/hilton.png",
    ],
    rating: 4.5, // Changed to a number
    name: "Dim Sum",
    description: "Traditional Chinese dumplings served with soy sauce.",
    price: 12.99,
    default: "All",
    type: "Chef's Special",
    category: "Chinese",
  },
  {
    id: 14,
    image: "/placeholder.jpeg",
    carouselImages: [
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/hilton.png",
    ],
    rating: 4.5, // Changed to a number
    name: "Dim Sum",
    description: "Traditional Chinese dumplings served with soy sauce.",
    price: 12.99,
    default: "All",
    type: "Chef's Special",
    category: "Chinese",
  },
];

export const todaysSpecials: Special[] = [
  {
    id: 6,
    image: "/placeholder.jpeg",
    carouselImages: [
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/hilton.png",
    ],
    rating: 4.8, // Changed to a number
    name: "Rogan Josh",
    description: "Spicy Kashmiri Indian curry with tender lamb.",
    price: 19.99,
    default: "All",
    type: "Today's Special",
    category: "Indian",
  },
  {
    id: 7,
    image: "/placeholder.jpeg",
    carouselImages: [
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/placeholder.jpeg",
      "/hilton.png",
    ],
    rating: 4.6, // Changed to a number
    name: "Peking Duck",
    description: "Famous Chinese roasted duck with crispy skin.",
    price: 25.99,
    default: "All",
    type: "Today's Special",
    category: "Chinese",
  },
];
