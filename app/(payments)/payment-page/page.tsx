"use client";

import { useEffect, useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Edit, Calendar, Clock, Users, MapPin, ChevronRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";
import PaymentForm from "../components/PaymentForm";

// Define OrderItem type
type OrderItem = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  [key: string]: any; // Allow additional properties
};

const SummaryPage = () => {
  const [reservation, setReservation] = useState<{
    date: string;
    time: string;
    guests: string;
    table: string;
  } | null>(null);

  // Fetching Pre-ordered Meals from Local Storage
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Get preOrder data from localStorage
        const savedItems = localStorage.getItem("preOrders");

        if (savedItems) {
          const parsedData = JSON.parse(savedItems);

          // If parsedData is an array, use it directly
          if (Array.isArray(parsedData)) {
            setItems(parsedData);
          }
          // If parsedData is an object (not null), convert it to an array with one item
          else if (parsedData && typeof parsedData === 'object') {
            console.log("Converting object to array:", parsedData);
            setItems([parsedData]);
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

  const [isOpen, setIsOpen] = useState(false);
  const [points, setPoints] = useState(100);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const userId = "user123";
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

    fetchReservation();
  }, []);

  useEffect(() => {
    if (Array.isArray(items)) {
      const calculatedTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotalPrice(calculatedTotal);
    } else {
      setTotalPrice(0);
    }
  }, [items]);

  const handleDelete = (id: string | number) => {
    if (Array.isArray(items)) {
      const updatedItems = items.filter((item) => item.id !== id);
      setItems(updatedItems);

      // Also update localStorage when item is removed
      if (typeof window !== "undefined") {
        if (updatedItems.length === 0) {
          localStorage.removeItem("preOrder");
        } else if (updatedItems.length === 1) {
          // If only one item remains, store as object
          localStorage.setItem("preOrder", JSON.stringify(updatedItems[0]));
        } else {
          // Store as array
          localStorage.setItem("preOrder", JSON.stringify(updatedItems));
        }
      }
    }
  };

  const applyPointsDiscount = () => {
    if (discountApplied || points <= 0) return;
    const discount = Math.min(points, totalPrice);
    setTotalPrice(totalPrice - discount);
    setPoints(points - discount);
    setDiscountApplied(true);
  };

  // Helper function to safely render items
  const renderItems = () => {
    if (!Array.isArray(items) || items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 bg-white/60 rounded-lg">
          <img src="/empty-plate.svg" alt="No meals" className="w-24 h-24 mb-4 opacity-40" />
          <p className="text-gray-500 text-center">No pre-ordered meals found.</p>
          <Button variant="outline" className="mt-4 text-[#FA4032] border-[#FA4032] hover:bg-[#FFECEB]">
            Browse Menu
          </Button>
        </div>
      );
    }

    return items.map((item) => (
      <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-3 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover shadow-sm" />
          <div>
            <p className="font-semibold text-gray-900">{item.name}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="px-2 py-0.5 bg-[#FFF0EF] text-[#FA4032] text-xs font-medium rounded-full">
                x{item.quantity}
              </span>
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
  const renderPaymentSummaryItems = () => {
    if (!Array.isArray(items) || items.length === 0) {
      return <p className="text-gray-600">No pre-ordered meals.</p>;
    }

    return items.map((item) => (
      <div key={item.id} className="flex justify-between py-2 border-b border-gray-100 last:border-none">
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#FFF5F4] to-white px-4 py-8">
      <Card className="p-0 shadow-lg rounded-xl border border-[#FFE5E2] w-full max-w-4xl mx-auto overflow-hidden">
        <div className="bg-[#FA4032] text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <Button variant="ghost" size="sm" className="text-white hover:bg-[#FB665B]">
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
          <div className="mt-2 text-white/80">Complete your reservation details below</div>
        </div>
        
        <div className="p-6">
          {/* Points display */}
          <div className="bg-gradient-to-r from-[#FFE5E2] to-[#FFF5F4] rounded-lg p-4 mb-6 flex justify-between items-center">
            <div>
              <span className="text-gray-700 font-medium">Available Points</span>
              <p className="text-2xl font-bold text-[#FA4032]">{points}</p>
            </div>
            <Button
              className={`bg-[#FA4032] text-white hover:bg-[#FB665B] ${
                discountApplied ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={applyPointsDiscount}
              disabled={discountApplied}
            >
              {discountApplied ? "Discount Applied" : "Apply Points"}
            </Button>
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
                <span>Rs.{(Array.isArray(items) ? items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0).toFixed(2)}</span>
              </div>
              
              {discountApplied && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Points Discount</span>
                  <span>-Rs.{Math.min(points, totalPrice + (discountApplied ? Math.min(points, totalPrice) : 0)).toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t border-dashed border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-[#FA4032]">Rs.{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Actions */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <Button className="w-full h-14 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-lg border border-gray-300 font-medium">
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
                          <span>Rs.{(Array.isArray(items) ? items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0).toFixed(2)}</span>
                        </div>
                        
                        {discountApplied && (
                          <div className="flex justify-between text-green-600 mt-2">
                            <span>Points Discount:</span>
                            <span>-Rs.{Math.min(points, totalPrice + (discountApplied ? Math.min(points, totalPrice) : 0)).toFixed(2)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between font-bold text-[#FA4032] mt-2 text-lg">
                          <span>Total:</span>
                          <span>Rs.{totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <PaymentForm amount={totalPrice} />
                    
                    <div className="mt-6 flex space-x-3">
                      <Button 
                        className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300" 
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="w-full bg-[#FA4032] text-white hover:bg-[#FB665B]"
                      >
                        Complete Payment
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

// Define DetailCard component - a more visual version of DetailRow
const DetailCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg">
    <div className="mb-1">{icon}</div>
    <span className="text-xs text-gray-500">{label}</span>
    <span className="font-semibold text-gray-900 mt-1">{value}</span>
  </div>
);

export default SummaryPage;