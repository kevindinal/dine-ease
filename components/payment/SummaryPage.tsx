"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function SummaryPage() {
  const router = useRouter();
  const [orders] = useState<OrderItem[]>([
    { id: 1, name: "Grilled Chicken", price: 15, quantity: 2 },
    { id: 2, name: "Pasta Carbonara", price: 12, quantity: 1 },
    { id: 3, name: "Caesar Salad", price: 10, quantity: 1 },
  ]);

  const totalAmount = orders.reduce((acc, item) => acc + item.price * item.quantity, 0);

  

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Order Summary</h2>
      <div className="space-y-4">
        {orders.map((item) => (
          <div key={item.id} className="flex justify-between p-4 border-b border-gray-300">
            <div>
              <p className="text-lg font-medium text-gray-700">{item.name}</p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <p className="text-lg font-semibold text-gray-800">Rs. {(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800">Total Amount:</h3>
        <h3 className="text-xl font-bold text-blue-600">Rs. {totalAmount.toFixed(2)}</h3>
      </div>
      
    </div>
  );
}
