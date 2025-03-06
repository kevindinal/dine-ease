import { FaStar } from "react-icons/fa6";

export default function GuestReviews() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Guest Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-start">
          <h3 className="font-semibold text-gray-800">Sarah Johnson</h3>
          <p className="text-gray-600 text-sm">December 2023</p>
          <div className="flex text-yellow-400">
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
          </div>
          <p className="text-gray-700 mt-2">Exceptional dining experience! The fusion dishes were innovative and delicious.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-start">
          <h3 className="font-semibold text-gray-800">Michael Chen</h3>
          <p className="text-gray-600 text-sm">November 2023</p>
          <div className="flex text-yellow-400">
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
          </div>
          <p className="text-gray-700 mt-2">Perfect atmosphere for a business dinner. Service was impeccable.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-start">
          <h3 className="font-semibold text-gray-800">Emma Williams</h3>
          <p className="text-gray-600 text-sm">November 2023</p>
          <div className="flex text-yellow-400">
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
          </div>
          <p className="text-gray-700 mt-2">Lovely ambiance and great food. The dessert menu was outstanding.</p>
        </div>
      </div>
    </div>
  );
}