
"use client";

import { useEffect, useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Edit, Calendar, Clock, Users, MapPin, ChevronRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc, updateDoc, DocumentData } from "firebase/firestore";
import { auth } from "@/lib/firebase"; // Import auth from firebase
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { Dialog, Transition } from "@headlessui/react";
import PaymentForm from "../components/PaymentForm";
import { useRouter } from "next/navigation";

// Define type for order items
type OrderItem = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  portionSize?: string;
  spiceLevel?: string;
  drinkPairing?: string;
  [key: string]: any;
};

// Define type for reservation
type Reservation = {
  date: string;
  time: string;
  guests: string;
  table: string;
};

// Define type for DetailCard props
interface DetailCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const SummaryPage = () => {
  const router = useRouter();
  
  // User ID - Now using state with null as initial value
  const [userId, setUserId] = useState<string | null>(null);
  
  // State for reservation details
  const [reservation, setReservation] = useState<Reservation>({
    date: "2025-03-17",
    time: "19:00",
    guests: "4",
    table: "12",
  });

  // State for order items and UI controls
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);
  const [isLoadingPoints, setIsLoadingPoints] = useState<boolean>(true);
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [pointsToDeduct, setPointsToDeduct] = useState<number>(0);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUserId(user.uid);
        console.log("User signed in with ID:", user.uid);
      } else {
        // User is signed out
        setUserId(null);
        console.log("User is signed out");
        // Optionally redirect to login page
        // router.push('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Fetch user points from Firebase - Now dependent on userId changes
  useEffect(() => {
    const fetchUserPoints = async (): Promise<void> => {
      try {
        if (!userId) {
          console.log("No user ID available, cannot fetch points");
          setIsLoadingPoints(false);
          setPoints(0);
          return;
        }

        setIsLoadingPoints(true);
        console.log("Fetching points for user ID:", userId);
        
        // Get user document from Firebase
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User data from Firebase:", userData);
          // Set points from the user document
          setPoints(userData.points || 0);
        } else {
          console.log("No user document found for ID:", userId);
          setPoints(0);
        }
      } catch (error) {
        console.error("Error fetching user points:", error);
        setPoints(0);
      } finally {
        setIsLoadingPoints(false);
      }
    };

    if (userId) {
      fetchUserPoints();
    }
  }, [userId]); // This effect now runs when userId changes

  // Load pre-order items from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Get preOrder data from localStorage
        const savedItems = localStorage.getItem("preOrders");

        if (savedItems) {
          const parsedData = JSON.parse(savedItems);

          // If parsedData is an array, use it directly
          if (Array.isArray(parsedData)) {
            // Ensure each item has a unique ID
            const itemsWithUniqueIds = parsedData.map((item, index) => ({
              ...item,
              id: item.id || `item-${index}`
            }));
            setItems(itemsWithUniqueIds);
          }
          // If parsedData is an object (not null), convert it to an array with one item
          else if (parsedData && typeof parsedData === 'object') {
            console.log("Converting object to array:", parsedData);
            setItems([{
              ...parsedData,
              id: parsedData.id || "item-0"
            }]);
          }
          else {
            console.error("preOrder data is not valid:", parsedData);
            setItems([]);
          }
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error parsing preOrder data:", error);
        setItems([]);
      }
    }
  }, []);

  // Fetch reservation data from Firebase - Also dependent on userId
  useEffect(() => {
    const fetchReservation = async (): Promise<void> => {
      try {
        if (!userId) {
          console.log("No user ID available, cannot fetch reservations");
          return;
        }

        const q = query(
          collection(db, "reservations"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setReservation({
            date: data.date,
            time: data.time,
            guests: data.guests,
            table: data.table,
          });
        }
      } catch (error) {
        console.error("Error fetching reservation:", error);
      }
    };

    if (userId) {
      fetchReservation();
    }
  }, [userId]); // This effect now runs when userId changes

  // Calculate total price when items change
  useEffect(() => {
    const calculatedTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(calculatedTotal);
  }, [items]);

  // Handle deletion of items
  const handleDelete = (id: string | number): void => {
    // Filter out the item with the matching id
    const updatedItems = items.filter((item) => item.id !== id);

    // Update the state
    setItems(updatedItems);

    // Update localStorage consistently
    if (typeof window !== "undefined") {
      if (updatedItems.length === 0) {
        // If no items left, remove the entry from localStorage
        localStorage.removeItem("preOrders");
      } else {
        // Store the updated array in localStorage
        localStorage.setItem("preOrders", JSON.stringify(updatedItems));
      }
    }
  };

  // Function to update quantity (increment or decrement)
  const updateQuantity = (id: string | number, action: 'increment' | 'decrement'): void => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        if (action === 'increment' && item.quantity < 5) {
          return { ...item, quantity: item.quantity + 1 };
        } else if (action === 'decrement' && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    });

    setItems(updatedItems);

    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("preOrders", JSON.stringify(updatedItems));
    }
  };

  // Function to update user points in Firebase
  const updateUserPointsInFirebase = async (newPoints: number): Promise<void> => {
    try {
      if (!userId) {
        console.error("Cannot update points: No user ID available");
        return;
      }

      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        points: newPoints
      });
      console.log("User points updated successfully in Firebase:", newPoints);
    } catch (error) {
      console.error("Error updating user points in Firebase:", error);
    }
  };

  // Apply points discount to total
  const applyPointsDiscount = async (): Promise<void> => {
    if (discountApplied || points <= 0) return;
    
    const discount = Math.min(points, totalPrice);
    setPointsToDeduct(discount);
    setTotalPrice(totalPrice - discount);
    
    // Update local state
    const newPointsValue = points - discount;
    setPoints(newPointsValue);
    setDiscountApplied(true);
    
    // Update points in Firebase
    await updateUserPointsInFirebase(newPointsValue);
  };

  // Function to add points after payment and navigate to order status page
  const addPointsAndNavigate = async (paymentMethod: string): Promise<void> => {
    try {
      if (userId) {
        // Add 10 points to the user's current points
        const newPoints = points + 10;
        setPoints(newPoints);
        
        // Update points in Firebase
        await updateUserPointsInFirebase(newPoints);
        console.log("Added 10 points for completing a payment");
      }
      
      // Save payment method info to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("paymentMethod", paymentMethod);
      }
      
      // Navigate to order status page
      router.push("/order-status");
    } catch (error) {
      console.error("Error adding points after payment:", error);
      // Still navigate to order status even if points update fails
      router.push("/order-status");
    }
  };

  // Function to navigate to order status page after pay at restaurant
  const navigateToOrderStatus = (): void => {
    addPointsAndNavigate("pay_at_restaurant");
  };

  // Function to handle payment completion
  const handlePaymentComplete = (): void => {
    // Close the payment modal
    setIsOpen(false);
    
    // Add points and navigate
    addPointsAndNavigate("paid_online");
  };

  // Helper function to safely render items
  const renderItems = (): React.ReactNode => {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 bg-white/60 rounded-lg">
          <img src="/empty-plate.svg" alt="No meals" className="w-24 h-24 mb-4 opacity-40" />
          <p className="text-gray-500 text-center">No pre-ordered meals found.</p>
          <Button variant="outline" className="mt-4 text-[#FA4032] border-[#FA4032] hover:bg-[#FFECEB]" onClick={() => window.history.back()}>
            Browse Menu
          </Button>
        </div>
      );
    }

    return items.map((item, index) => (
      <div key={`order-item-${item.id}-${index}`} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-3 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover shadow-sm" />
          <div>
            <p className="font-semibold text-gray-900">{item.name}</p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center px-2 py-0.5 bg-[#FFF0EF] text-[#FA4032] text-xs font-medium rounded-full">
                <button 
                  onClick={() => updateQuantity(item.id, 'decrement')}
                  className="mr-2 hover:bg-[#FFD5D2] rounded-full w-4 h-4 flex items-center justify-center"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>x{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 'increment')}
                  className="ml-2 hover:bg-[#FFD5D2] rounded-full w-4 h-4 flex items-center justify-center"
                >
                  +
                </button>
              </div>
              {item.portionSize && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {item.portionSize}
                </span>
              )}
              {item.spiceLevel && (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                  {item.spiceLevel}
                </span>
              )}
            </div>
            {item.drinkPairing && item.drinkPairing !== "No pairing" && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Paired with:</span> {item.drinkPairing}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className="font-bold text-[#FA4032]">Rs.{(item.price * item.quantity).toFixed(2)}</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-[#FA4032] hover:bg-[#FFF0EF] p-1 h-auto"
            onClick={() => handleDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ));
  };

  // Helper function to safely render payment summary items
  const renderPaymentSummaryItems = (): React.ReactNode => {
    if (items.length === 0) {
      return <p className="text-gray-600">No pre-ordered meals.</p>;
    }

    return items.map((item, index) => (
      <div key={`payment-item-${item.id}-${index}`} className="flex justify-between py-2 border-b border-gray-100 last:border-none">
        <div>
          <span className="font-medium">{item.name}</span>
          <div className="text-sm text-gray-600 flex items-center flex-wrap gap-1 mt-1">
            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">x{item.quantity}</span>
            {item.portionSize && <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">{item.portionSize}</span>}
            {item.spiceLevel && <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">{item.spiceLevel}</span>}
          </div>
        </div>
        <span className="font-semibold">Rs.{(item.price * item.quantity).toFixed(2)}</span>
      </div>
    ));
  };

  // Show loading state if user authentication is still being determined
  if (userId === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#FFF5F4] to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FA4032]"></div>
          <p className="mt-4 text-gray-600">Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#FFF5F4] to-white px-4 py-8">
      <Card className="p-0 shadow-lg rounded-xl border border-[#FFE5E2] w-full max-w-4xl mx-auto overflow-hidden">
        <div className="bg-[#FA4032] text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-[#FB665B]"
              onClick={() => router.push('/cuisine-main-page')}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
          <div className="mt-2 text-white/80">Complete your reservation details below</div>
        </div>
        <div className="p-6">
          {/* Points display */}
          <div className="bg-gradient-to-r from-[#FFE5E2] to-[#FFF5F4] rounded-lg p-4 mb-6 flex justify-between items-center">
            {isLoadingPoints ? (
              <div className="animate-pulse w-full">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/6"></div>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-gray-700 font-medium">Available Points</span>
                  <p className="text-2xl font-bold text-[#FA4032]">{points}</p>
                  {discountApplied && (
                    <p className="text-xs text-green-600 mt-1">
                      {pointsToDeduct} points applied as discount
                    </p>
                  )}
                </div>
                <Button
                  className={`bg-[#FA4032] text-white hover:bg-[#FB665B] ${
                    discountApplied || points <= 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={applyPointsDiscount}
                  disabled={discountApplied || points <= 0}
                >
                  {discountApplied ? "Discount Applied" : points <= 0 ? "No Points Available" : "Apply Points"}
                </Button>
              </>
            )}
          </div>

          {/* Reservation Details */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Reservation Details</h3>

            {reservation ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailCard
                  icon={<Calendar className="h-5 w-5 text-[#FA4032]" />}
                  label="Date"
                  value={reservation.date}
                />
                <DetailCard
                  icon={<Clock className="h-5 w-5 text-[#FA4032]" />}
                  label="Time"
                  value={reservation.time}
                />
                <DetailCard
                  icon={<Users className="h-5 w-5 text-[#FA4032]" />}
                  label="Guests"
                  value={reservation.guests}
                />
                <DetailCard
                  icon={<MapPin className="h-5 w-5 text-[#FA4032]" />}
                  label="Table"
                  value={reservation.table}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-2 bg-slate-200 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-2 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pre-ordered Meals */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Pre-ordered Meals</h3>
            {renderItems()}
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Payment Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-gray-700">
                <span>Subtotal</span>
                <span>Rs.{items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
              </div>

              {discountApplied && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Points Discount</span>
                  <span>-Rs.{pointsToDeduct.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-dashed border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-[#FA4032]">Rs.{totalPrice.toFixed(2)}</span>
                </div>
                
                {!discountApplied && (
                  <div className="text-sm text-gray-500 mt-1">
                    Complete your order to earn 10 loyalty points!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Actions */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <Button 
              className="w-full h-14 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-lg border border-gray-300 font-medium"
              onClick={() => {
                // Create a toast or notification message
                const notification: HTMLDivElement = document.createElement('div');
                notification.className = 'fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50 animate-fade-in flex items-center';
                notification.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                notification.innerHTML = `
                  <div class="bg-green-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900">Thank you!</h3>
                    <p class="text-sm text-gray-600">You selected to pay at the restaurant</p>
                    <p class="text-sm text-green-600">You earned 10 loyalty points!</p>
                  </div>
                `;
                
                document.body.appendChild(notification);
                
                // Add fade-in animation
                if (typeof document !== 'undefined') {
                  const style: HTMLStyleElement = document.createElement('style');
                  style.innerHTML = `
                    @keyframes fadeIn {
                      0% { opacity: 0; transform: translateY(-20px); }
                      100% { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in {
                      animation: fadeIn 0.3s ease-out forwards;
                    }
                  `;
                  document.head.appendChild(style);
                }
                
                // Navigate to order status page after 4 seconds
                setTimeout(() => {
                  // Optional: Add fade-out animation before navigating
                  notification.style.transition = 'opacity 0.3s, transform 0.3s';
                  notification.style.opacity = '0';
                  notification.style.transform = 'translateY(-20px)';
                  
                  setTimeout(() => {
                    // Remove the notification before navigating
                    if (document.body.contains(notification)) {
                      document.body.removeChild(notification);
                    }
                    // Navigate to order status page with points update
                    navigateToOrderStatus();
                  }, 300);
                }, 4000);
              }}
            >
              Pay at Restaurant <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            <Button
              className="w-full h-14 bg-[#FA4032] text-white hover:bg-[#FB665B] rounded-lg font-medium"
              onClick={() => setIsOpen(true)}
            >
              Pay Now <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Payment Form Modal */}
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-60" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full transform transition-all">
                    <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                      Payment Details
                    </Dialog.Title>

                    {/* Display pre-ordered meals in payment summary */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-3 text-gray-700">Pre-ordered Items:</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {renderPaymentSummaryItems()}

                        <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-semibold">
                          <span>Subtotal:</span>
                          <span>Rs.{items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                        </div>

                        {discountApplied && (
                          <div className="flex justify-between text-green-600 mt-2">
                            <span>Points Discount:</span>
                            <span>-Rs.{pointsToDeduct.toFixed(2)}</span>
                          </div>
                        )}

                        <div className="flex justify-between font-bold text-[#FA4032] mt-2 text-lg">
                          <span>Total:</span>
                          <span>Rs.{totalPrice.toFixed(2)}</span>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-2 mt-3 text-green-700 text-sm">
                          <p className="font-medium">Complete payment to earn 10 loyalty points!</p>
                        </div>
                      </div>
                    </div>

                    <PaymentForm amount={totalPrice} onPaymentComplete={handlePaymentComplete} />

                    <div className="mt-6 flex space-x-3">
                      <Button
                        className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </Card>
    </div>
  );
};

// DetailCard component with TypeScript props
const DetailCard = ({ icon, label, value }: DetailCardProps) => (
  <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg">
    <div className="mb-1">{icon}</div>
    <span className="text-xs text-gray-500">{label}</span>
    <span className="font-semibold text-gray-900 mt-1">{value}</span>
  </div>
);

export default SummaryPage;