"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
// Import addDoc for adding reviews to Firebase
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/tables";
import {
  ArrowLeft,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Star,
  CheckCircle,
  XCircle,
  Heart,
  Share2,
  ImageIcon,
  RotateCw,
  Menu,
  MessageSquare,
  Copy,
  Mail,
  Facebook,
  Twitter,
  Bell,
  MapPin,
  Users,
  DollarSign,
  Info,
  Phone,
  Instagram,
  Clock8,
  Wifi,
  Utensils,
  CreditCard,
  Gift,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import Fallback360Viewer from "@/app/(reservations)/table-reservation/fall-back-360";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { auth } from "@/lib/firebase/tables";

// Import our components
import ReviewSection from "@/app/(reservations)/table-reservation/components/review-section";
import ReservationForm from "@/app/(reservations)/table-reservation/components/reservation-form";
import SpecialOffers from "@/app/(reservations)/table-reservation/components/special-offers";
import FeaturesSection from "@/app/(reservations)/table-reservation/components/features-section";
import AvailabilityCalendar from "@/app/(reservations)/table-reservation/components/availability-calendar";
// Add this import at the top of the file, which was missing
import ThreeSixtyViewer from "@/app/(reservations)/table-reservation/thresixty";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";

interface Table {
  id: string;
  name: string;
  location: string;
  status: string;
  seats: number;
  description?: string;
  price?: number;
  imageUrl?: string;
  imageUrls?: string[]; // Add this line
  threeSixtyImageUrl?: string;
  additionalImages?: string[];
  reviews?: Review[];
  rating?: number;
  features?: string[];
  restaurantId?: string; // Added restaurantId property
  availability?: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    timeRanges: Array<{
      from: string;
      to: string;
    }>;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
    instagram?: string;
    facebook?: string;
  };
}

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  tableId?: string;
}

interface ReservationData {
  date: Date | undefined;
  time: string;
  guests: number;
  occasion: string;
  specialRequests: string;
  promoCode?: string;
  promoDiscount?: number;
}

interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  validUntil: string;
}

export default function TableDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeView, setActiveView] = useState<"gallery" | "360">("gallery");
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [occasion, setOccasion] = useState("");
  const [specialR, setSpecialR] = useState("");

  const [user, setUser] = useState({
    name: "Guest",
    email: "",
    avatar: "/placeholder.svg?height=40&width=40",
  });

  const [contactInfo, setContactInfo] = useState({
    phone: "(555) 123-4567",
    email: "reservations@restaurant.com",
    instagram: "@restaurantname",
    facebook: "facebook.com/restaurantname",
  });

  // Mock data for special offers
  const specialOffers: SpecialOffer[] = [
    {
      id: "offer1",
      title: "Early Bird Special",
      description: "Book before 3PM and get 15% off your reservation",
      discount: "15%",
      code: "EARLY15",
      validUntil: "2025-06-30",
    },
    {
      id: "offer2",
      title: "Weekend Brunch",
      description: "Special weekend brunch menu with complimentary mimosa",
      discount: "Free Drink",
      code: "BRUNCH",
      validUntil: "2025-12-31",
    },
    {
      id: "offer3",
      title: "Anniversary Special",
      description:
        "Celebrating an anniversary? Get a free dessert with your meal",
      discount: "Free Dessert",
      code: "CELEBRATE",
      validUntil: "2025-12-31",
    },
  ];

  // Mock reviews data
  const mockReviews: Review[] = [
    {
      id: "rev1",
      userName: "Sarah Johnson",
      userAvatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      comment:
        "Absolutely loved this table! The window view was spectacular and service was impeccable.",
      date: "2025-02-15",
    },
    {
      id: "rev2",
      userName: "Michael Chen",
      userAvatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      comment:
        "Great location, comfortable seating. Perfect for our business lunch.",
      date: "2025-02-10",
    },
    {
      id: "rev3",
      userName: "Jessica Williams",
      userAvatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      comment:
        "The ambiance was perfect for our anniversary dinner. Highly recommend!",
      date: "2025-01-28",
    },
  ];

  // Mock availability data if none exists
  const mockAvailability = {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
    timeRanges: [
      { from: "11:00", to: "15:00" },
      { from: "17:30", to: "22:00" },
    ],
  };

  useEffect(() => {
    // Try to get user from local storage first
    const localStorageUser = localStorage.getItem("user");

    if (localStorageUser) {
      try {
        const parsedUser = JSON.parse(localStorageUser);
        setUser({
          name: parsedUser.name || "Guest",
          email: parsedUser.email || "",
          avatar: parsedUser.avatar || "/placeholder.svg?height=40&width=40",
        });
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }

    // Also listen for Firebase auth changes as fallback
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser && !localStorageUser) {
        setUser({
          name: currentUser.displayName || "Guest",
          email: currentUser.email || "",
          avatar: currentUser.photoURL || "/placeholder.svg?height=40&width=40",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Check if the current table is in user's favorites
    const checkIfFavorite = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser && id) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.favorites && Array.isArray(userData.favorites)) {
              setIsFavorite(userData.favorites.includes(id));
            }
          }
        }
      } catch (error) {
        console.error("Error checking favorites:", error);
      }
    };

    if (id) {
      checkIfFavorite();
    }
  }, [id]);

  useEffect(() => {
    const fetchTable = async () => {
      setLoading(true);
      try {
        const tableDoc = await getDoc(doc(db, "tables", id as string));

        if (!tableDoc.exists()) {
          setError("Table not found");
          setLoading(false);
          return;
        }

        const tableData = tableDoc.data() as Omit<Table, "id">;
        let imageUrls: string[] = [];
        let threeSixtyImageUrl = tableData.threeSixtyImageUrl;

        // Check if table has imageUrls array (new format)
        if (tableData.imageUrls && Array.isArray(tableData.imageUrls)) {
          try {
            // Process imageUrls array
            const processedUrls = await Promise.all(
              tableData.imageUrls.map(async (imgUrl) => {
                if (!imgUrl) return null;

                if (imgUrl && !imgUrl.startsWith("http")) {
                  try {
                    const storageRef = ref(storage, imgUrl);
                    return await getDownloadURL(storageRef);
                  } catch (error) {
                    console.error("Error fetching image URL: ", error);
                    return null;
                  }
                }
                return imgUrl;
              })
            );

            // Filter out any null values
            imageUrls = processedUrls.filter(Boolean) as string[];
          } catch (error) {
            console.error("Error processing imageUrls:", error);
            // If there's an error processing the array, use an empty array
            imageUrls = [];
          }
        } else {
          // Handle legacy format with imageUrl and additionalImages
          let imageUrl = tableData.imageUrl;
          threeSixtyImageUrl = tableData.threeSixtyImageUrl;
          const additionalImages = tableData.additionalImages || [];

          // Process main image URL
          if (imageUrl && !imageUrl.startsWith("http")) {
            try {
              const storageRef = ref(storage, imageUrl);
              imageUrl = await getDownloadURL(storageRef);
              imageUrls.push(imageUrl);
            } catch (error) {
              console.error("Error fetching image URL: ", error);
            }
          } else if (imageUrl) {
            imageUrls.push(imageUrl);
          }

          // Process 360 image URL
          threeSixtyImageUrl = tableData.threeSixtyImageUrl;
          if (threeSixtyImageUrl && !threeSixtyImageUrl.startsWith("http")) {
            try {
              const storageRef = ref(storage, threeSixtyImageUrl);
              threeSixtyImageUrl = await getDownloadURL(storageRef);
              console.log(
                "Successfully processed 360 image URL:",
                threeSixtyImageUrl
              );
            } catch (error) {
              console.error("Error fetching 360 image URL: ", error);
              threeSixtyImageUrl = undefined;
            }
          }

          // Process additional images
          const processedAdditionalImages = await Promise.all(
            additionalImages.map(async (imgUrl) => {
              if (imgUrl && !imgUrl.startsWith("http")) {
                try {
                  const storageRef = ref(storage, imgUrl);
                  return await getDownloadURL(storageRef);
                } catch (error) {
                  console.error("Error fetching additional image URL: ", error);
                  return null;
                }
              }
              return imgUrl;
            })
          );

          // Add processed additional images to imageUrls array
          imageUrls = [
            ...imageUrls,
            ...(processedAdditionalImages.filter(Boolean) as string[]),
          ];
        }

        // Fetch reviews from table-reviews collection
        let reviews: Review[] = [];
        try {
          const reviewsQuery = query(
            collection(db, "table-reviews"),
            where("tableId", "==", id)
          );
          const reviewsSnapshot = await getDocs(reviewsQuery);

          if (!reviewsSnapshot.empty) {
            reviews = reviewsSnapshot.docs.map(
              (doc) =>
                ({
                  id: doc.id,
                  ...doc.data(),
                } as Review)
            );
          } else {
            console.log("No reviews found in Firebase, using mock reviews");
            reviews = mockReviews;
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
          reviews = mockReviews;
        }

        // Add mock features if none exist
        const features = tableData.features || [
          "Window View",
          "Premium Service",
          "Charging Outlets",
          "Ambient Lighting",
          "Privacy",
          "Air Conditioning",
        ];

        // Add mock availability if none exists
        const availability = tableData.availability || mockAvailability;

        // Fetch contact information if restaurantId exists
        let contactInfo = {
          phone: "(555) 123-4567",
          email: "reservations@restaurant.com",
          instagram: "@restaurantname",
          facebook: "facebook.com/restaurantname",
        };

        if (tableData.restaurantId) {
          try {
            const restaurantDoc = await getDoc(
              doc(db, "restaurants", tableData.restaurantId)
            );
            if (restaurantDoc.exists()) {
              const restaurantData = restaurantDoc.data();
              contactInfo = {
                phone: restaurantData.phone || contactInfo.phone,
                email: restaurantData.email || contactInfo.email,
                instagram: restaurantData.instagram || contactInfo.instagram,
                facebook: restaurantData.facebook || contactInfo.facebook,
              };
            }
          } catch (error) {
            console.error("Error fetching restaurant contact info:", error);
            // Use default contact info if there's an error
          }
        }

        setTable({
          id: tableDoc.id,
          ...tableData,
          imageUrl: imageUrls[0] || "",
          threeSixtyImageUrl,
          additionalImages: imageUrls.slice(1),
          reviews,
          features,
          availability,
          contactInfo,
        });
        setContactInfo(contactInfo);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching table:", error);
        setError("Failed to load table information");
        setLoading(false);
      }
    };

    if (id) {
      fetchTable();
    }
  }, [id]);

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleReservation = (reservationData: ReservationData) => {
    // Store the reservation data in state
    setReservationDate(
      reservationData.date
        ? reservationData.date.toISOString().split("T")[0]
        : ""
    );
    setReservationTime(reservationData.time);
    setGuestCount(reservationData.guests.toString());
    setOccasion(reservationData.occasion);
    setSpecialR(reservationData.specialRequests);

    // If there's a promo code applied in the form, update the discount
    if (reservationData.promoDiscount) {
      setPromoDiscount(reservationData.promoDiscount);
    }

    console.log("Reservation data received:", reservationData);

    // Save reservation data to localStorage
   

    // Show payment options
    setShowPaymentOptions(true);
  };


  const handlePaymentOption = (option: "payment" | "preorder") => {
    setShowPaymentOptions(false);
    setReservationSuccess(true);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);

    // Create query parameters with reservation details
    const queryParams = new URLSearchParams({
      tableId: table?.id || "",
      tableName: table?.name || "",
      date: reservationDate,
      time: reservationTime,
      guests: guestCount,
      occasion: occasion,
      specialRequests: specialR,
      promoDiscount: promoDiscount.toString(),
    }).toString();

    if (option === "payment") {
      if (table?.restaurantId) {
        router.push(
          `/payment-page?restaurantId=${encodeURIComponent(
            table?.restaurantId
          )}&${queryParams}`
        );
      }
    } else {
      if (table?.restaurantId) {
        router.push(
          `/cuisine-main-page/${encodeURIComponent(
            table.restaurantId
          )}?${queryParams}`
        );
      }
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        // If user is not logged in, prompt them to log in
        alert("Please log in to save favorites");
        return;
      }

      if (!table?.id) {
        console.error("Table ID is missing");
        return;
      }

      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      // Toggle favorite status
      const newFavoriteStatus = !isFavorite;

      if (userDoc.exists()) {
        // Update existing user document
        await updateDoc(userDocRef, {
          favorites: newFavoriteStatus
            ? arrayUnion(table.id)
            : arrayRemove(table.id),
        });
      } else {
        // Create new user document if it doesn't exist
        await setDoc(userDocRef, {
          favorites: newFavoriteStatus ? [table.id] : [],
          email: currentUser.email,
          name: currentUser.displayName || "User",
          createdAt: new Date(),
        });
      }

      // Update local state
      setIsFavorite(newFavoriteStatus);

      // Show notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

      console.log(
        `Table ${newFavoriteStatus ? "added to" : "removed from"} favorites`
      );
    } catch (error) {
      console.error("Error updating favorites:", error);
      alert("Failed to update favorites. Please try again.");
    }
  };

  const handleApplyPromoCode = (code: string) => {
    // Check if promo code matches any special offers
    const offer = specialOffers.find(
      (offer) => offer.code === code.toUpperCase()
    );
    if (offer) {
      // Apply discount
      if (offer.discount.includes("%")) {
        const percentage = Number.parseInt(offer.discount);
        setPromoDiscount(percentage);
      } else {
        // For non-percentage discounts, just show success
        setPromoDiscount(10); // Default to 10% for demo
      }
      // Show success notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } else {
      // Show error for invalid code
      alert("Invalid promo code. Please try again.");
    }
  };

  // Replace the handleSubmitReview function with this updated version
  const handleSubmitReview = async (rating: number, comment: string) => {
    // Add the new review to the table's reviews
    if (table && comment.trim()) {
      try {
        // Create the review object with the logged-in user's name
        const newReview: Review = {
          id: `rev${Date.now()}`,
          userName: user.name, // Use the logged-in user's name
          userAvatar: user.avatar, // Use the logged-in user's avatar
          rating,
          comment,
          date: new Date().toISOString().split("T")[0],
          tableId: table.id, // Add tableId to associate with the table
        };

        // Add the review to Firebase
        const reviewsCollection = collection(db, "table-reviews");
        const docRef = await addDoc(reviewsCollection, {
          userName: newReview.userName,
          userAvatar: newReview.userAvatar,
          rating: newReview.rating,
          comment: newReview.comment,
          date: newReview.date,
          tableId: table.id,
        });

        // Update the review ID with the Firebase document ID
        newReview.id = docRef.id;

        // Update local state
        setTable({
          ...table,
          reviews: [...(table.reviews || []), newReview],
        });

        // Show success notification
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } catch (error) {
        console.error("Error adding review:", error);
        alert("Failed to submit review. Please try again.");
      }
    }
  };

  const nextImage = () => {
    const images =
      table?.imageUrls ||
      [table?.imageUrl, ...(table?.additionalImages || [])].filter(Boolean);

    if (images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    const images =
      table?.imageUrls ||
      [table?.imageUrl, ...(table?.additionalImages || [])].filter(Boolean);

    if (images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  const toggleFullscreen = () => {
    if (!imageContainerRef.current) return;

    if (!isFullscreen) {
      if (imageContainerRef.current.requestFullscreen) {
        imageContainerRef.current.requestFullscreen();
      } else if ((imageContainerRef.current as any).webkitRequestFullscreen) {
        // Safari
        (imageContainerRef.current as any).webkitRequestFullscreen();
      } else if ((imageContainerRef.current as any).msRequestFullscreen) {
        // IE11
        (imageContainerRef.current as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        // Safari
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        // IE11
        (document as any).msExitFullscreen();
      }
    }
  };

  const shareTable = (platform: string) => {
    const url = window.location.href;
    const title = `Check out this amazing table: ${table?.name}`;

    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "email":
        window.open(
          `mailto:?subject=${encodeURIComponent(
            title
          )}&body=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
    }

    setShowShareOptions(false);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        {/* Header with Navigation - Loading State */}
        <div className="bg-white sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="mr-2" disabled>
                <ArrowLeft className="h-5 w-5 text-gray-300" />
              </Button>
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex gap-2">
              {isMobile ? (
                <Skeleton className="h-10 w-10 rounded-full" />
              ) : (
                <>
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Loading State */}
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status and Rating */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-32 rounded-full" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>

              {/* Main Image Gallery */}
              <Skeleton className="w-full aspect-[16/9] rounded-xl" />

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-16 w-16 rounded-md flex-shrink-0"
                  />
                ))}
              </div>

              {/* Availability Calendar */}
              <Skeleton className="w-full h-48 rounded-xl" />

              {/* Special Offers */}
              <Skeleton className="w-full h-40 rounded-xl" />

              {/* Table Information */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-8 w-24 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            </div>

            {/* Right Column - Reservation Form */}
            <div>
              <div className="sticky top-20">
                <Skeleton className="h-[500px] w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Table</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Tables
          </Button>
        </div>
      </div>
    );
  }

  if (!table) {
    return null;
  }

  const isAvailable = Boolean(table?.status?.toLowerCase() === "available");
  console.log("Table status:", table?.status, "isAvailable:", isAvailable);
  const allImages =
    table.imageUrls ||
    ([table.imageUrl, ...(table.additionalImages || [])].filter(
      Boolean
    ) as string[]);
  // Calculate the actual average rating from reviews if available
  const calculatedRating = table?.reviews?.length
    ? (
        table.reviews.reduce((sum, review) => sum + review.rating, 0) /
        table.reviews.length
      ).toFixed(1)
    : "4.0";
  const rating = table?.rating || calculatedRating;

  return (
    <div className="bg-white min-h-screen">
      {/* Header with Navigation */}
      <div className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Navbar />
          <div className="flex items-center pt-20">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold truncate">{table.name}</h1>
          </div>

          <div className="flex gap-2 pt-20">
            {isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setShowMobileMenu(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-full",
                    isFavorite ? "text-red-500" : ""
                  )}
                  onClick={handleToggleFavorite}
                >
                  <Heart
                    className={cn("h-5 w-5", isFavorite ? "fill-red-500" : "")}
                  />
                </Button>
                <Popover
                  open={showShareOptions}
                  onOpenChange={setShowShareOptions}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-0" align="end">
                    <div className="p-2">
                      <p className="text-sm font-medium px-2 py-1.5">
                        Share this table
                      </p>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm px-2 py-1.5 h-9"
                        onClick={() => shareTable("copy")}
                      >
                        <Copy className="h-4 w-4 mr-2" /> Copy link
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm px-2 py-1.5 h-9"
                        onClick={() => shareTable("facebook")}
                      >
                        <Facebook className="h-4 w-4 mr-2" /> Facebook
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm px-2 py-1.5 h-9"
                        onClick={() => shareTable("twitter")}
                      >
                        <Twitter className="h-4 w-4 mr-2" /> Twitter
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm px-2 py-1.5 h-9"
                        onClick={() => shareTable("email")}
                      >
                        <Mail className="h-4 w-4 mr-2" /> Email
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-full",
                    isReminderSet ? "text-amber-500" : ""
                  )}
                  onClick={() => setIsReminderSet(!isReminderSet)}
                >
                  <Bell
                    className={cn(
                      "h-5 w-5",
                      isReminderSet ? "fill-amber-500" : ""
                    )}
                  />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetContent side="right">
          <SheetHeader className="mb-4">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="grid gap-3 ">
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                handleToggleFavorite();
                setShowMobileMenu(false);
              }}
            >
              <Heart
                className={cn(
                  "h-5 w-5 mr-2",
                  isFavorite ? "fill-red-500 text-red-500" : ""
                )}
              />
              {isFavorite ? "Saved to favorites" : "Save to favorites"}
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                setShowShareOptions(true);
                setShowMobileMenu(false);
              }}
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share this table
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                setIsReminderSet(!isReminderSet);
                setShowMobileMenu(false);
              }}
            >
              <Bell
                className={cn(
                  "h-5 w-5 mr-2",
                  isReminderSet ? "fill-amber-500 text-amber-500" : ""
                )}
              />
              {isReminderSet ? "Cancel reminder" : "Set reminder"}
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => setShowMobileMenu(false)}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Write a review
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Success Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="fixed top-20 right-4 z-50 bg-green-50 border border-green-200 text-green-800 rounded-lg shadow-lg p-4 max-w-xs"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Success!</h4>
                <p className="text-xs text-green-700 mt-1">
                  {reservationSuccess
                    ? "Your reservation has been confirmed."
                    : isFavorite
                    ? "Table saved to your favorites."
                    : "Your action was completed successfully."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status and Rating */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Badge
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium",
                    isAvailable
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  )}
                >
                  {isAvailable ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle size={14} />
                      Available
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <XCircle size={14} />
                      Reserved
                    </span>
                  )}
                </Badge>

                {table.threeSixtyImageUrl && (
                  <div className="flex bg-gray-200 rounded-full p-1 shadow-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "rounded-full px-3 text-xs h-8",
                        activeView === "gallery"
                          ? "bg-white shadow-sm"
                          : "bg-transparent"
                      )}
                      onClick={() => setActiveView("gallery")}
                    >
                      <ImageIcon className="h-3.5 w-3.5 mr-1.5" /> Gallery
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "rounded-full px-3 text-xs h-8",
                        activeView === "360"
                          ? "bg-white shadow-sm"
                          : "bg-transparent"
                      )}
                      onClick={() => setActiveView("360")}
                    >
                      <RotateCw className="h-3.5 w-3.5 mr-1.5" /> 360° View
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <div className="flex items-center text-amber-500 mr-2">
                  <Star size={18} className="fill-amber-500 mr-1" />
                  <span className="font-medium">{rating}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-8 px-2">
                  {table.reviews?.length || 0}{" "}
                  {table.reviews?.length === 1 ? "review" : "reviews"}
                </Button>
              </div>
            </div>

            {/* Main Image Gallery */}
            <div
              ref={imageContainerRef}
              className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[16/9] shadow-md"
            >
              {activeView === "gallery" ? (
                <>
                  <img
                    src={allImages[currentImageIndex] || "/placeholder.svg"}
                    alt={`${table.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {allImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 bottom-2 bg-white/80 hover:bg-white/90 rounded-full"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize className="h-5 w-5" />
                    ) : (
                      <Maximize className="h-5 w-5" />
                    )}
                  </Button>

                  {/* Image Counter */}
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                      {currentImageIndex + 1} / {allImages.length}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {table.threeSixtyImageUrl ? (
                    <>
                      <div className="w-full h-full">
                        {/* Use both components with a fallback mechanism */}
                        {process.env.NODE_ENV !== "production" ? (
                          <ThreeSixtyViewer imageUrl={"/ll.jpg"} />
                        ) : (
                          <Fallback360Viewer
                            imageUrl={table.threeSixtyImageUrl}
                          />
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                          360° View - Click and drag to explore
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-100">
                      <div className="text-gray-500 text-center">
                        <RotateCw className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>360° view not available</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Thumbnails - only show in gallery view */}
            {activeView === "gallery" && allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "cursor-pointer h-16 w-16 flex-shrink-0 p-0.5",
                      currentImageIndex === idx
                        ? "border-2 border-primary rounded-md"
                        : "opacity-70 hover:opacity-100 border-2 border-transparent rounded-md"
                    )}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <div className="w-full h-full overflow-hidden rounded-sm">
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Availability Calendar */}
            <AvailabilityCalendar availability={table.availability} />

            {/* Special Offers */}
            <SpecialOffers
              offers={specialOffers}
              onApplyCode={handleApplyPromoCode}
            />

            {/* Table Information */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="text-gray-700">{table.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-500" />
                  <span className="text-gray-700">
                    Seats {table.seats} people
                  </span>
                  {table.price && (
                    <>
                      <span className="mx-2 text-gray-300">•</span>
                      <div className="flex items-center text-gray-700">
                        <DollarSign size={16} className="mr-0.5" />
                        <span className="font-medium">
                          ${table.price.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {table.description && (
              <div className="pt-2">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  About this table
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {table.description}
                </p>
              </div>
            )}

            {/* Features and Amenities */}
            <FeaturesSection
              features={table.features || []}
              seats={table.seats}
            />

            {/* Reviews Section */}
            <ReviewSection
              reviews={table.reviews || []}
              rating={rating.toString()}
              onSubmitReview={handleSubmitReview}
            />

            {/* Additional Information */}
            <div className="pt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="amenities">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800">
                    Dining Information
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                      <li className="flex items-center">
                        <Clock8 size={16} className="mr-2 text-gray-500" />
                        Average dining time: 1.5 hours
                      </li>
                      <li className="flex items-center">
                        <Wifi size={16} className="mr-2 text-gray-500" />
                        Free Wi-Fi available
                      </li>
                      <li className="flex items-center">
                        <Utensils size={16} className="mr-2 text-gray-500" />
                        Full menu available
                      </li>
                      <li className="flex items-center">
                        <CreditCard size={16} className="mr-2 text-gray-500" />
                        All major credit cards accepted
                      </li>
                      <li className="flex items-center">
                        <Gift size={16} className="mr-2 text-gray-500" />
                        Gift cards available
                      </li>
                      <li className="flex items-center">
                        <Percent size={16} className="mr-2 text-gray-500" />
                        Special offers available
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="policies">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800">
                    Reservation Policies
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <Info size={16} className="mr-2 mt-0.5 text-blue-500" />
                        Reservations must be made at least 2 hours in advance
                      </li>
                      <li className="flex items-start">
                        <Info size={16} className="mr-2 mt-0.5 text-blue-500" />
                        Cancellations must be made at least 1 hour before
                        reservation time
                      </li>
                      <li className="flex items-start">
                        <Info size={16} className="mr-2 mt-0.5 text-blue-500" />
                        Late arrivals may result in table being given to other
                        guests
                      </li>
                      <li className="flex items-start">
                        <Info size={16} className="mr-2 mt-0.5 text-blue-500" />
                        A credit card is required to hold your reservation
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="contact">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800">
                    Contact Information
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center">
                        <Phone size={16} className="mr-2 text-gray-500" />
                        <span>
                          {table.contactInfo?.phone || contactInfo.phone}
                        </span>
                      </li>
                      <li className="flex items-center">
                        <Mail size={16} className="mr-2 text-gray-500" />
                        <span>
                          {table.contactInfo?.email || contactInfo.email}
                        </span>
                      </li>
                      <li className="flex items-center">
                        <Instagram size={16} className="mr-2 text-gray-500" />
                        <span>
                          {table.contactInfo?.instagram ||
                            contactInfo.instagram}
                        </span>
                      </li>
                      <li className="flex items-center">
                        <Facebook size={16} className="mr-2 text-gray-500" />
                        <span>
                          {table.contactInfo?.facebook || contactInfo.facebook}
                        </span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Right Column - Reservation Form */}
          <div>
            <ReservationForm
              tablePrice={table.price || 0}
              tableSeats={table.seats}
              isAvailable={isAvailable}
              onReservation={handleReservation}
              promoDiscount={promoDiscount}
              onApplyPromoCode={handleApplyPromoCode}
              availability={table.availability}
            />
          </div>
        </div>
      </div>
      {/* Payment Options Dialog */}
      <Dialog open={showPaymentOptions} onOpenChange={setShowPaymentOptions}>
        <DialogContent className="sm:max-w-[400px] w-[90%] max-w-[350px] mx-auto rounded-xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Complete Your Reservation
            </DialogTitle>
            <DialogDescription>
              Would you like to proceed to payment or preorder your meals now?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              onClick={() => handlePaymentOption("payment")}
              className="w-full flex items-center justify-center gap-2"
            >
              <CreditCard className="h-5 w-5" />
              Proceed to Payment
            </Button>
            <Button
              onClick={() => handlePaymentOption("preorder")}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Utensils className="h-5 w-5" />
              Preorder Meals
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}
