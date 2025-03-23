"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Star, StarHalf, MessageCircle, X } from "lucide-react"
import { db, auth } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

type Review = {
  id: string
  userId: string
  userName: string
  userImage?: string
  rating: number
  comment: string
  createdAt: any
}

type MenuItem = {
  id: string
  name: string
  price: number
  image: string
  description?: string
  "food review"?: Review[] // Changed to match the desired field name
}

type FeaturedMenuProps = {
  featuredMenu?: MenuItem[]
  restaurantId?: string
}

export default function FeaturedMenu({ featuredMenu, restaurantId }: FeaturedMenuProps) {
  const [user] = useAuthState(auth)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sample menu items if none provided
  const sampleMenu: MenuItem[] = [
    {
      id: "menu-item-1",
      name: "Grilled Salmon",
      price: 24.99,
      image:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      description: "Fresh salmon fillet grilled to perfection with herbs and lemon",
      "food review": [],
    },
    {
      id: "menu-item-2",
      name: "Beef Wellington",
      price: 32.99,
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
      description: "Tender beef wrapped in puff pastry with mushroom duxelles",
      "food review": [],
    },
    {
      id: "menu-item-3",
      name: "Vegetable Risotto",
      price: 18.99,
      image:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      description: "Creamy arborio rice with seasonal vegetables and parmesan",
      "food review": [],
    },
  ]

  // Initialize menu items
  useEffect(() => {
    const initialMenu =
      featuredMenu && featuredMenu.length > 0
        ? featuredMenu.map((item) => ({
            ...item,
            id: item.id || `menu-item-${Math.random().toString(36).substr(2, 9)}`,
            "food review": item["food review"] || [],
          }))
        : sampleMenu

    setMenuItems(initialMenu)

    // If we don't have reviews in the featuredMenu, fetch the restaurant document to get the latest data
    if (restaurantId && (!featuredMenu || featuredMenu.some((item) => !item["food review"]))) {
      fetchRestaurantData(restaurantId)
    }
  }, [featuredMenu, restaurantId])

  // Fetch restaurant data to get the latest menu items with reviews
  const fetchRestaurantData = async (restaurantId: string) => {
    try {
      const restaurantDoc = await getDoc(doc(db, "restaurants", restaurantId))

      if (restaurantDoc.exists()) {
        const data = restaurantDoc.data()

        if (data.featuredMenu && Array.isArray(data.featuredMenu)) {
          const updatedMenu = data.featuredMenu.map((item: any) => ({
            ...item,
            id: item.id || `menu-item-${Math.random().toString(36).substr(2, 9)}`,
            "food review": item["food review"] || [],
          }))

          setMenuItems(updatedMenu)
        }
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error)
      setError("Failed to fetch restaurant data. Please try again.")
    }
  }

  // Submit a review directly to the featuredMenu array in the restaurant document
  const submitReview = async () => {
    if (!user || !selectedItem || !reviewText.trim() || rating < 1 || !restaurantId) {
      setError("Missing required information to submit review")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Get user data from localStorage if available
      let userName = "Anonymous User"
      let userImage = ""

      try {
        const localStorageUser = localStorage.getItem("user")
        if (localStorageUser) {
          const userData = JSON.parse(localStorageUser)
          userName = userData.name || userData.firstName || user.displayName || "Anonymous User"
          userImage = userData.avatar || userData.image || user.photoURL || ""
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error)
      }

      // Create a new review object
      const newReview = {
        id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        userId: user.uid,
        userName: userName,
        userImage: userImage,
        rating: rating,
        comment: reviewText.trim(),
        createdAt: new Date().toISOString(),
      }

      console.log("Submitting review:", newReview)
      console.log("Restaurant ID:", restaurantId)
      console.log("Selected item ID:", selectedItem.id)

      // Get the restaurant document reference
      const restaurantRef = doc(db, "restaurants", restaurantId)

      // Get the current restaurant data
      const restaurantDoc = await getDoc(restaurantRef)

      if (restaurantDoc.exists()) {
        const restaurantData = restaurantDoc.data()
        const featuredMenu = restaurantData.featuredMenu || []

        console.log("Current featuredMenu:", featuredMenu)

        // Find the index of the menu item to update
        const menuItemIndex = featuredMenu.findIndex((item: any) => item.id === selectedItem.id)

        console.log("Menu item index:", menuItemIndex)

        if (menuItemIndex !== -1) {
          // Create a new array with the updated menu item
          const updatedFeaturedMenu = [...featuredMenu]

          // Initialize food review array if it doesn't exist
          if (!updatedFeaturedMenu[menuItemIndex]["food review"]) {
            updatedFeaturedMenu[menuItemIndex]["food review"] = []
          }

          // Add the new review
          updatedFeaturedMenu[menuItemIndex]["food review"].push(newReview)

          console.log("Updated featuredMenu:", updatedFeaturedMenu)

          // Update the restaurant document
          await updateDoc(restaurantRef, {
            featuredMenu: updatedFeaturedMenu,
          })

          console.log("Document updated successfully")

          // Update local state
          setMenuItems((prev) =>
            prev.map((item) =>
              item.id === selectedItem.id
                ? {
                    ...item,
                    "food review": [...(item["food review"] || []), newReview],
                  }
                : item,
            ),
          )

          // Reset form
          setReviewText("")
          setRating(5)
          setReviewDialogOpen(false)
        } else {
          setError(`Menu item with ID ${selectedItem.id} not found in restaurant document`)
        }
      } else {
        setError(`Restaurant with ID ${restaurantId} not found`)
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      setError("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete a review (only if user is the author)
  const deleteReview = async (reviewId: string, menuItemId: string) => {
    if (!user || !restaurantId) return

    try {
      // Get the restaurant document reference
      const restaurantRef = doc(db, "restaurants", restaurantId)

      // Get the current restaurant data
      const restaurantDoc = await getDoc(restaurantRef)

      if (restaurantDoc.exists()) {
        const restaurantData = restaurantDoc.data()
        const featuredMenu = restaurantData.featuredMenu || []

        // Find the index of the menu item to update
        const menuItemIndex = featuredMenu.findIndex((item: any) => item.id === menuItemId)

        if (menuItemIndex !== -1 && featuredMenu[menuItemIndex]["food review"]) {
          // Find the review to delete
          const reviewIndex = featuredMenu[menuItemIndex]["food review"].findIndex(
            (review: any) => review.id === reviewId && review.userId === user.uid,
          )

          if (reviewIndex !== -1) {
            // Create a new array with the updated menu item
            const updatedFeaturedMenu = [...featuredMenu]

            // Remove the review
            updatedFeaturedMenu[menuItemIndex]["food review"].splice(reviewIndex, 1)

            // Update the restaurant document
            await updateDoc(restaurantRef, {
              featuredMenu: updatedFeaturedMenu,
            })

            // Update local state
            setMenuItems((prev) =>
              prev.map((item) =>
                item.id === menuItemId
                  ? {
                      ...item,
                      "food review": item["food review"]?.filter((review) => review.id !== reviewId) || [],
                    }
                  : item,
              ),
            )
          }
        }
      }
    } catch (error) {
      console.error("Error deleting review:", error)
      setError("Failed to delete review. Please try again.")
    }
  }

  // Calculate average rating for a menu item
  const getAverageRating = (reviews?: Review[]) => {
    if (!reviews || reviews.length === 0) return 0

    const sum = reviews.reduce((total, review) => total + review.rating, 0)
    return sum / reviews.length
  }

  // Render stars for a rating
  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}

        {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}

        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}

        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="py-12 sm:py-16 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-8 sm:mb-12"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Featured Menu</h2>
        <div className="h-1 w-20 bg-red-500 mx-auto rounded-full"></div>
        <p className="text-gray-600 mt-3 sm:mt-4 max-w-2xl mx-auto">
          Discover our chef's special selection of exquisite dishes
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        {menuItems.map((item, index) => {
          const avgRating = getAverageRating(item["food review"])
          const reviewCount = item["food review"]?.length || 0

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden group"
            >
              <div className="relative h-48 sm:h-60 overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm">{item.description || `Delicious ${item.name} prepared by our expert chefs`}</p>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                  {/* <span className="text-red-500 font-bold">${item.price.toFixed(2)}</span> */}
                </div>

                {/* Rating display */}
                <div className="flex items-center justify-between mt-2">
                  {renderRatingStars(avgRating)}
                  <span className="text-sm text-gray-500">
                    {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <button
                    className="text-red-500 font-medium text-sm flex items-center group-hover:text-red-600"
                    onClick={() => {
                      setSelectedItem(item)
                      setReviewDialogOpen(true)
                      setError(null)
                    }}
                  >
                    <MessageCircle className="mr-1 h-4 w-4" />
                    Add Review
                  </button>

                  <button className="text-red-500 font-medium text-sm flex items-center group-hover:text-red-600">
                    View Details{" "}
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="text-center mt-8 sm:mt-10">
        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
          View Full Menu
        </button>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedItem ? `Review: ${selectedItem.name}` : "Add Review"}</DialogTitle>
            <DialogDescription>Share your experience with this dish</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Rating selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Rating</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                    <Star
                      className={`w-6 h-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review text */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Review</label>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this dish..."
                rows={4}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
            )}

            {/* Display existing reviews */}
            {selectedItem?.["food review"] && selectedItem["food review"].length > 0 && (
              <div className="space-y-3 mt-6">
                <h4 className="font-medium text-sm border-b pb-2">Previous Reviews</h4>
                <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                  {selectedItem["food review"].map((review) => (
                    <div key={review.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={review.userImage || ""} alt={review.userName} />
                            <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{review.userName}</p>
                            <div className="flex items-center">{renderRatingStars(review.rating)}</div>
                          </div>
                        </div>

                        {user && user.uid === review.userId && (
                          <button
                            onClick={() => deleteReview(review.id, selectedItem.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm mt-2 text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={submitReview}
              disabled={!user || isSubmitting || !reviewText.trim() || rating < 1 || !restaurantId}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>

          {!user && (
            <p className="text-sm text-center text-amber-600 mt-2">You need to be logged in to submit a review</p>
          )}

          {!restaurantId && (
            <p className="text-sm text-center text-amber-600 mt-2">Restaurant ID is required to submit reviews</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

