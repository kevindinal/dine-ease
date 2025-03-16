
import Navbar from "@/components/header/Navbar";
import HighlyRatedRestaurants from "../components/HighlyRatedRestaurants";
import RestaurantCarousel from "../components/RestaurantCarousel";
import Testimonials from "../components/Testimonials";
import Footer from "@/components/footer/Footer";
import { ArrowRight } from "lucide-react";
import WeeklyOffers from "../components/WeeklyOffers";
import { Button } from "@/components/ui/button";




export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F1FF] to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
            alt="Restaurant ambiance"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="container mx-auto flex flex-col items-center justify-center text-center relative z-10 gap-8">
          <div className="w-full max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-[#1B1B1B] mb-6 animate-fade-in">
              Revolutionizing Dining with Smart AI & AR
            </h1>
            <p className="text-lg md:text-xl text-[#3A3A3A] mb-8 animate-fade-in">
              Experience the future of dining with our AI-powered restaurant platform.
              Book tables, pre-order meals, and explore menus in AR.
            </p>
            <Button
              size="lg"
              className="bg-[#FA4032] hover:bg-[#FFECEB] font-semibold text-[#FFECEB] hover:text-[#FA4032] transition-all duration-300 animate-fade-in"
            >
              Make a Reservation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <RestaurantCarousel />
        </div>
      </section>

      {/* Highly Rated Restaurants Section */}
      <section className="bg-[#FFECEB]">
        <HighlyRatedRestaurants />
      </section>

      {/* Weekly offers */}
      <WeeklyOffers />

      {/* Testimonial Section */}
      <Testimonials />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
