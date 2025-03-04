"use client";  // ✅ Add this to make it a Client Component if needed
import Image from "next/image";
import LandingPage from "./(home)/home-main/page";

export default function HomePage() {
  return (
    <div>
      <LandingPage />
    </div>
  );
}