"use client";

import { useState } from  'react';
// import { Button } from "@/components/ui/button";
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

