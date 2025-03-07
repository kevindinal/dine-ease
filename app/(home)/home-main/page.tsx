import { Component } from "lucide-react";
import Navbar from "@/components/header/Navbar";
import HighlyRatedRestaurants from "../components/HighlyRatedRestaurants";
import RestaurantCarousel from "../components/RestaurantCarousel";
import Testimonials from "../components/Testimonials";
import Footer from "@/components/footer/Footer";







export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-softer to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://unsplash.com/photos/3d-render-of-luxury-restaurant-interior-V9CVO_cv-78"
            alt="Restaurant ambiance"
            className="w-full h-full object-cover opacity-40" 
          />
        </div>

        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold text-accent-darkest mb-6 animate-fade-in">
              Revolutionizing Dining with Smart AI & AR
            </h1>
            <p className="text-lg md:text-xl text-accent-darker mb-8 animate-fade-in">
              Experience the future of dining with our AI-powered restaurant platform.
              Book tables, pre-order meals, and explore menus in AR.
            </p>
            <button className="bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg transition-all duration-300">
              Make a Reservation
            </button>

          </div>
        </div>
      </section>


      <HighlyRatedRestaurants />
      <RestaurantCarousel />
      <Testimonials />
      <Footer />
    </div>
  );
}
