import Image from 'next/image'
import React from 'react'

interface FoodCategoryProps {
  imageSrc: string;
  foodType: string;
}

const FoodCategory: React.FC<FoodCategoryProps> = ({ imageSrc, foodType }) => {
  return (
    <div className='flex flex-col items-center'>
      <div className='w-24 h-24 overflow-hidden shadow-md rounded-full'>
        <Image
          src={imageSrc}
          alt={foodType}
          width={96}  
          height={96}  
          className='object-cover w-full h-full'
        />
      </div>
      <p className='mt-2 text-sm font-medium text-gray-700'>{foodType}</p>
    </div>
  )
}

export default FoodCategory
