"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/home-main"); // Redirect to /home-main
  }, [router]);

  return null; // Optionally, render nothing while redirecting
};

export default Home;