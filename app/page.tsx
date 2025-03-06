"use client";  // ✅ Add this to make it a Client Component if needed

import MealPreOrderMain from "./(cuisine)/cuisine-main-page/page";
import RestaurantBooking from "./(restaurants)/restaurants/page";

export default function HomePage() {
  return (
    <div>
      <MealPreOrderMain/>
      </div>
  );
}
