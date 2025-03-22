// Restaurant model
export interface Restaurant {
    id: string
    name: string
    image: string
    location: string
    rating: number | string
    reviews: number
    priceRange: string
    cuisine?: string
    openingHours?: string
  }
  
  // Weekly Offer model
  export interface WeeklyOffer {
    id: string
    offer_name: string
    offer_image: string
    old_price: number
    this_week_price: number
    restaurant: string
  }
  
  // User/Testimonial model
  export interface User {
    uid: string
    firstName: string
    user_review: string
    email?: string
    lastName?: string
    // profile_image is not in Firebase, we'll handle fallbacks
  }