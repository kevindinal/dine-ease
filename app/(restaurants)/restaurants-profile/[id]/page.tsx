import { restaurants } from "@/data/restaurrants";
import RestaurantProfile from "../../components/RestaurantProfile/RestaurantProfile";

export default function RestaurantProfilePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  // Find the restaurant by ID from the params
  const restaurant = restaurants.find((r) => r.id.toString() === params.id) || restaurants[0];

  // Uncomment this when you're ready to use Firebase
  // async function getServerSideData() {
  //   const restaurant = await getRestaurantById(params.id);
  //   if (!restaurant) {
  //     return { notFound: true };
  //   }
  //   return { restaurant };
  // }

  return <RestaurantProfile restaurant={restaurant} />;
}