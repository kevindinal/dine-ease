'use client';

import React from 'react'
import { categories, recommendedForYou, chefsSpecials, todaysSpecials, Special} from '../../data/data'
import FoodCard from '../../components/FoodCard';
import usePreOrder from '../../hooks/usePreOrder';
import FloatingButtons from '../../components/FloatingButtons';
import { useParams } from 'next/navigation';

export default function CuisineViewMore() {

  const { type } = useParams();

  const cuisineData: Record<string, Special[]> = {
    "recommended": recommendedForYou,
    "chefs-specials": chefsSpecials,
    "todays-specials": todaysSpecials,
  };

  const cuisines = cuisineData[type as string] || [];

  const { preOrderCount, addItemToPreOrder, clearPreOrder } = usePreOrder();

  return (
    <div
      className={` bg-[url('/background.png')] bg-cover bg-center bg-fixed min-h-screen`}
    >
      <nav>Navigation Bar</nav>

      <section className="py-4 mx-4 md:mx-14 z-10 fixed bottom-32 left-0 right-0 flex justify-center">
        <FloatingButtons
          preOrderCount={preOrderCount}
          setPreOrderCount={clearPreOrder}
        />
      </section>

      <section className="py-4 mx-4 md:mx-14 relative">
       <h1 className='text-3xl font-bold mb-6 text-center'> {type} </h1>
       <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
        {cuisines.length > 0 ?(
          cuisines.map((cuisine) => (
            <div key={cuisine.id}>
              <FoodCard
                image={cuisine.image}
                rating={cuisine.rating}
                name={cuisine.name}
                description={cuisine.description}
                price={cuisine.price}
                onAddToPreOrder={addItemToPreOrder}
              />
            </div>
          ))
        ) : (
          <div className='text-center text-2xl font-bold text-gray-800'>
            No {type} available
          </div>
        )}
       </div>
      </section>
    </div>
  )
}
