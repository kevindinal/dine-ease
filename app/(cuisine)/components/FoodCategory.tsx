import Image from 'next/image'
import React from 'react'

interface FoodCategoryProps {
  imageSrc: string;
  foodType: string;
}

const FoodCategory: React.FC<FoodCategoryProps> = ({ imageSrc, foodType }) => {
  return (
    <div className='flex flex-col items-center'>
      <div className='overflow-hidden shadow-md rounded-full'>
        <Image
          src={imageSrc}
          alt={foodType}
          width={100}
          height={100}
          className='w-full h-full object-cover rounded-full'
        />
      </div>
      <p className='mt-2 text-sm font-medium text-gray-700'>{foodType}</p>
    </div>
  )
}

export default FoodCategory
