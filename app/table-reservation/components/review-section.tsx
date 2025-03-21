"use client"

import { useState, useRef } from "react"
import { Star, MessageSquare, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  date: string
}

interface ReviewSectionProps {
  reviews: Review[]
  rating: string
  onSubmitReview: (rating: number, comment: string) => void
}

export default function ReviewSection({ reviews, rating, onSubmitReview }: ReviewSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const reviewFormRef = useRef<HTMLDivElement>(null)
  const [showAllReviews, setShowAllReviews] = useState(false)

  const totalReviews = reviews?.length || 0

  // Calculate rating distribution for reviews
  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0] // 5 stars to 1 star

    if (!reviews || reviews.length === 0) return distribution

    reviews.forEach((review) => {
      const ratingIndex = Math.min(Math.max(Math.floor(review.rating) - 1, 0), 4)
      distribution[4 - ratingIndex]++
    })

    return distribution
  }

  const ratingDistribution = getRatingDistribution()

  // Determine which reviews to display based on showAllReviews state
  const displayedReviews = showAllReviews || (reviews?.length || 0) <= 4 ? reviews : reviews?.slice(0, 4)

  const handleSubmitReview = () => {
    if (reviewComment.trim()) {
      onSubmitReview(reviewRating, reviewComment)
      setReviewComment("")
      setReviewRating(5)
      setShowReviewForm(false)
    }
  }

  return (
    <div className="pt-6" ref={reviewFormRef}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Reviews</h3>
        <Button variant="outline" size="sm" onClick={() => setShowReviewForm(!showReviewForm)}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Write a review
        </Button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-800 mb-3">Share your experience</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rating" className="text-sm text-gray-700">
                Rating
              </Label>
              <div className="flex items-center mt-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                    onClick={() => setReviewRating(star)}
                  >
                    <Star
                      className={cn(
                        "h-6 w-6",
                        star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-gray-300",
                      )}
                    />
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="comment" className="text-sm text-gray-700">
                Your review
              </Label>
              <Textarea
                id="comment"
                placeholder="Share your experience with this table..."
                className="mt-1.5"
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSubmitReview} disabled={!reviewComment.trim()}>
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Summary */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4 min-w-[120px]">
          <div className="text-4xl font-bold text-gray-800">{rating}</div>
          <div className="flex items-center mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn("h-4 w-4", star <= Number(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300")}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </div>
        </div>

        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star, index) => (
            <div key={star} className="flex items-center mb-1.5">
              <div className="flex items-center w-16">
                <span className="text-xs font-medium text-gray-700 mr-1">{star}</span>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{
                    width: totalReviews > 0 ? `${(ratingDistribution[index] / totalReviews) * 100}%` : "0%",
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 ml-2 w-8">{ratingDistribution[index]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {displayedReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={review.userAvatar} alt={review.userName} />
                    <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-800">{review.userName}</div>
                    <div className="flex items-center mt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-3.5 w-3.5",
                            star <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300",
                          )}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-2">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <ThumbsUp className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
              <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
            </div>
          ))}

          {/* Show "See All" button if there are more than 4 reviews and not all are shown */}
          {reviews.length > 4 && !showAllReviews && (
            <div className="text-center pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowAllReviews(true)} className="w-full max-w-xs">
                See All {reviews.length} Reviews
              </Button>
            </div>
          )}

          {/* Show "Show Less" button if all reviews are shown and there are more than 4 */}
          {reviews.length > 4 && showAllReviews && (
            <div className="text-center pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowAllReviews(false)} className="w-full max-w-xs">
                Show Less
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <h4 className="text-gray-500 font-medium">No reviews yet</h4>
          <p className="text-gray-400 text-sm mt-1">Be the first to share your experience</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowReviewForm(true)}>
            Write a review
          </Button>
        </div>
      )}
    </div>
  )
}

