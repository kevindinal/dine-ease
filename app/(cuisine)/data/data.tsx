interface Special {
  id: number;
  image: string;
  rating: string;
  name: string;
  description: string;
  price: number;
  type: "Recommended" | "Chef's Special" | "Today's Special"; // To differentiate the type
}

interface Category {
  imageSrc: string;
  foodType: string;
}

export const categories: Category[] = [
  { imageSrc: "/placeholder.jpeg", foodType: "Pizza" },
  { imageSrc: "/placeholder.jpeg", foodType: "Pizza" },
  { imageSrc: "/placeholder.jpeg", foodType: "Pizza" },
  { imageSrc: "/placeholder.jpeg", foodType: "Pizza" },
  { imageSrc: "/placeholder.jpeg", foodType: "Pizza" },
  { imageSrc: "/placeholder.jpeg", foodType: "Pizza" },
  { imageSrc: "/placeholder.jpeg", foodType: "Pizza" },
  { imageSrc: "/placeholder.jpeg", foodType: "Pizza" },
  { imageSrc: "/placeholder.jpeg", foodType: "Pizza" },
  { imageSrc: "/placeholder.jpeg", foodType: "Pizza" },
];

export const recommendedForYou: Special[] = [
  {
    id: 1,
    image: "/placeholder.jpeg",
    rating: "4.8",
    name: "Spaghetti Carbonara",
    description: "A creamy and savory pasta with pancetta and parmesan.",
    price: 15.99,
    type: "Recommended",
  },
  {
    id: 2,
    image: "/placeholder.jpeg",
    rating: "4.6",
    name: "California Roll",
    description: "Fresh crab and avocado wrapped in seaweed and rice.",
    price: 13.99,
    type: "Recommended",
  },
  {
    id: 3,
    image: "/placeholder.jpeg",
    rating: "4.7",
    name: "Grilled Salmon",
    description: "Fresh salmon grilled to perfection with a citrus glaze.",
    price: 22.99,
    type: "Recommended",
  },
  {
    id: 4,
    image: "/placeholder.jpeg",
    rating: "4.9",
    name: "Lobster Bisque",
    description: "A rich and creamy bisque with sweet lobster meat.",
    price: 24.99,
    type: "Recommended",
  },
];

export const chefsSpecials: Special[] = [
  {
    id: 1,
    image: "/placeholder.jpeg",
    rating: "4.8",
    name: "Spaghetti Carbonara",
    description: "A creamy and savory pasta with pancetta and parmesan.",
    price: 15.99,
    type: "Chef's Special",
  },
  {
    id: 2,
    image: "/placeholder.jpeg",
    rating: "4.6",
    name: "California Roll",
    description: "Fresh crab and avocado wrapped in seaweed and rice.",
    price: 13.99,
    type: "Chef's Special",
  },
  {
    id: 3,
    image: "/placeholder.jpeg",
    rating: "4.7",
    name: "Grilled Salmon",
    description: "Fresh salmon grilled to perfection with a citrus glaze.",
    price: 22.99,
    type: "Chef's Special",
  },
  {
    id: 4,
    image: "/placeholder.jpeg",
    rating: "4.9",
    name: "Lobster Bisque",
    description: "A rich and creamy bisque with sweet lobster meat.",
    price: 24.99,
    type: "Chef's Special",
  },
];

export const todaysSpecials: Special[] = [
  {
    id: 1,
    image: "/placeholder.jpeg",
    rating: "4.8",
    name: "Spaghetti Carbonara",
    description: "A creamy and savory pasta with pancetta and parmesan.",
    price: 15.99,
    type: "Today's Special",
  },
  {
    id: 2,
    image: "/placeholder.jpeg",
    rating: "4.6",
    name: "California Roll",
    description: "Fresh crab and avocado wrapped in seaweed and rice.",
    price: 13.99,
    type: "Today's Special",
  },
  {
    id: 3,
    image: "/placeholder.jpeg",
    rating: "4.7",
    name: "Grilled Salmon",
    description: "Fresh salmon grilled to perfection with a citrus glaze.",
    price: 22.99,
    type: "Today's Special",
  },
  {
    id: 4,
    image: "/placeholder.jpeg",
    rating: "4.9",
    name: "Lobster Bisque",
    description: "A rich and creamy bisque with sweet lobster meat.",
    price: 24.99,
    type: "Today's Special",
  },
];
