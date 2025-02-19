import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface FoodItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
}

export default function useFetchFoodData() {
  const [categories, setCategories] = useState<FoodItem[]>([]);
  const [recommendedForYou, setRecommendedForYou] = useState<FoodItem[]>([]);
  const [todaysSpecials, setTodaysSpecials] = useState<FoodItem[]>([]);
  const [chefsSpecials, setChefsSpecials] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const recommendedSnapshot = await getDocs(collection(db, "recommendedForYou"));
        const specialsSnapshot = await getDocs(collection(db, "todaysSpecials"));
        const chefsSnapshot = await getDocs(collection(db, "chefsSpecials"));

        setCategories(categoriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as FoodItem)));
        setRecommendedForYou(recommendedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as FoodItem)));
        setTodaysSpecials(specialsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as FoodItem)));
        setChefsSpecials(chefsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as FoodItem)));
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return { categories, recommendedForYou, todaysSpecials, chefsSpecials, loading };
}
