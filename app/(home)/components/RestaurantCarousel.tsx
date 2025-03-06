
"use client";

import { useState } from  'react';
//import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const restaurants = [
    {
        id: 1,
        name: "La Belle Cuisine",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        cuisine: "French",
        rating: 4.8,
    },
    {
        id:2,
        name: "Sakura Sushi",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
        cuisine: "Indian",
        rating: 4.7,
    },
    {
        id: 3,
        name: "Splice Garden",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
        cuisine: "Indian",
        rating: 4.7,
    },
    {
        id: 4,
        name: "Tuscany Treats",
        image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae",
        cuisine: "Italian",
        rating: 4.6,
    },
    {
        id: 5,
        name: "The Green Table",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
        cuisine: "Vegetarian",
        rating: 4.5,
    },
];

const RestaurantCarousel = () => {
    const [currentIndex,  setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === restaurants.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? restaurants.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="relative w-full overflow-hidden py-8">
            <h2 className="text-3xl font-bold text-accent-dark mb-8 text-center">
                Top Restaurants of the Week
            </h2>
            <div className="relative flex items-center justify-center">
                {/* <Button 
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full"
                    onClick={prevSlide}
                >
                    <ChevronLeft className="h-6 2-6" />
                </Button> */}

                <div className="flex transition-transform duration-500 ease-in-out transform"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {restaurants.map((restaurant, index) => (
                        <div
                            key={restaurant.id}
                            className="min-w-full px-4 sm:min-w-[50%] md:min-w-[33.333%] lg:min-w-[25%]"
                        >
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden tranform transition-all duration-300 hover:scale-105">
                                <div className="relative h-48">
                                    <img 
                                        src={restaurant.image}
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-accent-dark">
                                        {restaurant.name}
                                    </h3>
                                    <p className="text-gray-600">{restaurant.cuisine}</p>
                                    <div className="flex items-center mt-2">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                        <span className="ml-1 text-sm">{restaurant.rating}</span>
                                    </div>
                                    {/* <Button 
                                        className="w-full mt-4 bg-primary hover:bg-primary-hover text-white transition-all"
                                    >
                                        View More
                                    </Button> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full"
                    onClick={nextSlide}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button> */}
            </div>
        </div>
    );
};

export default RestaurantCarousel;
