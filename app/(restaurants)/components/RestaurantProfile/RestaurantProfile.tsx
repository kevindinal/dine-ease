"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendar, FaClock, FaUsers, FaStar, FaBus, FaCar, FaCreditCard, FaWifi } from "react-icons/fa6";
import BannerSection from "./BannerSection";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";
import FeaturedMenu from "./FeaturedMenu";
import GuestReviews from "./GustReview";
import LocationSection from "./LocationSection";

type Restaurant = {
  id: number | string;
  name: string;
  bannerImage: string;
  description: string;
  about: string;
  cuisine: string[];
  priceRange: string;
  category: string;
  location: string;
  address: string;
  photos: string[];
  featuredMenu: {
    name: string;
    price: string;
    image: string;
  }[];
};

type RestaurantProfileProps = {
  restaurant: Restaurant;
};

export default function RestaurantProfile({ restaurant }: RestaurantProfileProps) {
  const router = useRouter();

  return (
    <div>
      <BannerSection restaurant={restaurant} />
      <AboutSection restaurant={restaurant} />
      <ServicesSection />
      <FeaturedMenu featuredMenu={restaurant.featuredMenu} />
      <GuestReviews />
      <LocationSection address={restaurant.address} />
    </div>
  );
}