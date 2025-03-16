"use client";

import { useEffect, useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
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
        const savedItems = localStorage.getItem("preOrder");

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
      return <p className="text-gray-600 text-center">No pre-ordered meals found.</p>;
    }

    return items.map((item) => (
      <div key={item.id} className="flex items-center justify-between p-4 bg-[#FEC6C2] rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover" />
          <div>
            <p className="font-medium text-gray-900">{item.name}</p>
            <p className="text-sm text-gray-700">Quantity: {item.quantity}</p>
            {item.portionSize && <p className="text-sm text-gray-700">Portion: {item.portionSize}</p>}
            {item.spiceLevel && <p className="text-sm text-gray-700">Spice Level: {item.spiceLevel}</p>}
            {item.drinkPairing && item.drinkPairing !== "No pairing" && (
              <p className="text-sm text-gray-700">Drink: {item.drinkPairing}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-900">Rs.{(item.price * item.quantity).toFixed(2)}</span>
          <Button variant="ghost" size="icon" className="text-[#FA4032] hover:text-[#FB665B]" onClick={() => handleDelete(item.id)}>
            <Trash2 className="h-5 w-5" />
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
      <div key={item.id} className="flex justify-between py-1">
        <div>
          <span className="font-medium">{item.name}</span>
          <div className="text-sm text-gray-600">
            <span>x{item.quantity}</span>
            {item.portionSize && <span> • {item.portionSize}</span>}
            {item.spiceLevel && <span> • {item.spiceLevel}</span>}
          </div>
        </div>
        <span>Rs.{(item.price * item.quantity).toFixed(2)}</span>
      </div>
    ));
  };

  return (
    <Card className="p-6 shadow-lg rounded-xl border bg-[#FFECEB] w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b border-[#FC8C84] pb-4 mb-6">
        <h2 className="text-2xl font-bold text-[#FA4032]">Order Summary</h2>
        <Button variant="ghost" size="sm" className="text-[#FA4032] hover:text-[#FB665B]">
          Edit
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-medium text-gray-800">Available Points:</span>
        <span className="text-lg font-bold text-[#FA4032]">{points}</span>
      </div>

        <div className="space-y-4 mb-6 text-gray-700">
          {reservation ? (
            <>
              <DetailRow label="Date" value={reservation.date} />
              <DetailRow label="Time" value={reservation.time} />
              <DetailRow label="Guests" value={reservation.guests} />
              <DetailRow label="Table" value={reservation.table} />
            </>
          ) : (
            <p className="text-gray-600">Loading reservation details...</p>
          )}
        </div>
      </div>

        <div className="border-t border-[#FC8C84] pt-6">
          <h3 className="text-lg font-semibold mb-4 text-[#FA4032]">Pre-ordered Meals</h3>
          <div className="space-y-4">
            {renderItems()}
          </div>
        </div>
        <div className="border-t border-[#FC8C84] pt-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold text-gray-800">Total:</span>
            <span className="text-xl font-bold text-[#FA4032]">Rs.{totalPrice.toFixed(2)}</span>
          </div>

          <Button
            className={`w-full h-14 bg-blue-500 text-white hover:bg-blue-600 rounded-lg ${discountApplied && "opacity-50 cursor-not-allowed"
              }`}
            onClick={applyPointsDiscount}
            disabled={discountApplied}
          >
            Reduce from Total
          </Button>

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <Button className="w-full md:w-1/2 h-14 bg-gray-700 text-white hover:bg-gray-800 rounded-lg">
              Pay at Restaurant
            </Button>
            <Button
              className="w-full md:w-1/2 h-14 bg-[#FA4032] text-white hover:bg-[#FB665B] rounded-lg"
              onClick={() => setIsOpen(true)}
            >
              Pay Now
            </Button>
          </div>
        </div>

        {/* Payment Form Modal */}
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h3 className="text-xl font-bold mb-4">Payment Summary</h3>

                {/* Display pre-ordered meals in payment summary */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Pre-ordered Meals:</h4>
                  {renderPaymentSummaryItems()}
                  <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between font-medium">
                    <span>Subtotal:</span>
                    <span>Rs.{totalPrice.toFixed(2)}</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Points Discount:</span>
                      <span>-Rs.{Math.min(points, totalPrice).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <PaymentForm amount={totalPrice} />
                <Button className="mt-4 w-full bg-gray-500 text-white" onClick={() => setIsOpen(false)}>
                  Close
                </Button>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>
      </Card>
    </div>
  );
};

// Define DetailRow component
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-gray-700">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export default SummaryPage;