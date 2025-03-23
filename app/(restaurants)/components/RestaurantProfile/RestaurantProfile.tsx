"use client"
import { useRouter } from "next/navigation"
import BannerSection from "./BannerSection"
import AboutSection from "./AboutSection"
import ServicesSection from "./ServicesSection"
import FeaturedMenu from "./FeaturedMenu"
import GuestReviews from "./GustReview"
import LocationSection from "./LocationSection"
import type { Restaurant } from "../../types/restaurant"

type RestaurantProfileProps = {
  restaurant: Restaurant
}

export default function RestaurantProfile({ restaurant }: RestaurantProfileProps) {
  const router = useRouter()

  return (
    <div className="bg-white min-h-screen">
      <BannerSection restaurant={restaurant} />
      <AboutSection restaurant={restaurant} />
      <ServicesSection />
      <FeaturedMenu featuredMenu={restaurant.featuredMenu} />
      {/* <GuestReviews reviews={restaurant.reviews} /> */}
      <GuestReviews />
      <LocationSection address={restaurant.address} location={restaurant.location} />
    </div>
  )
}

