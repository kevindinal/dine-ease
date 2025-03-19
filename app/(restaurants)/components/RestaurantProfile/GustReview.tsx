import { FaStar } from "react-icons/fa6";
import { Review } from "../../types/restaurant";

interface GuestReviewsProps {
  reviews?: Review[] | null;  // Make the prop optional and allow null
}

export default function GuestReviews({ reviews }: GuestReviewsProps) {
  // Check if reviews exists and is an array
  const reviewsArray = Array.isArray(reviews) ? reviews : [];
  
  if (reviewsArray.length === 0) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Guest Reviews</h2>
        <p className="text-gray-500">No reviews available yet.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Guest Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviewsArray.map((review) => (
          <div key={review.id} className="bg-white p-4 rounded-lg shadow flex flex-col items-start">
            <h3 className="font-semibold text-gray-800">{review.username}</h3>
            <p className="text-gray-600 text-sm">
              {new Date(review.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
              ))}
            </div>
            <p className="text-gray-700 mt-2">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}