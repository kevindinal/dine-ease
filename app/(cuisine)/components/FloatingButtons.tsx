import React, { FC } from "react";
import { PreOrderItem } from "../types/preOrderTypes";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2 } from "lucide-react";

interface FloatingButtonsProps {
  preOrderCount: number;
  preOrders: PreOrderItem[];
  clearPreOrder: () => void;
  removePreOrderItem: (itemId: string, customizationKey: string) => void;
  onPreOrderCountClick: () => void;
}

const FloatingButtons: FC<FloatingButtonsProps> = ({ 
  preOrderCount, 
  preOrders, 
  clearPreOrder, 
  removePreOrderItem,
  onPreOrderCountClick 
}) => {
  const router = useRouter();

  const handleCancelPreOrder = () => {
    if (preOrderCount === 0) return;
    
    if (window.confirm("Are you sure you want to cancel the pre-order?")) {
      clearPreOrder();
      alert("Pre-order canceled.");
    }
  };

  const handleCheckout = () => {
    if (preOrderCount === 0) {
      alert("Please add items to your order before proceeding to checkout.");
      return;
    }
    router.push("/payment-page");
  };

  // Calculate total price of all items in the pre-order
  const totalPrice = preOrders.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  return (
    <div className="fixed bottom-6 left-0 right-0 mx-auto max-w-md px-4">
      <div className="bg-white rounded-xl shadow-xl p-4 border border-gray-100 flex flex-col">
        {preOrderCount > 0 && (
          <div className="flex justify-between items-center mb-3 text-sm text-gray-600">
            <span>{preOrderCount} {preOrderCount === 1 ? 'item' : 'items'}</span>
            <span className="font-medium text-gray-800">Total: ${totalPrice.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between gap-3">
          <button
            onClick={handleCancelPreOrder}
            className={`px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
              preOrderCount > 0 
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
                : "bg-gray-50 text-gray-400 cursor-not-allowed"
            }`}
            disabled={preOrderCount === 0}
          >
            <Trash2 size={18} />
            <span className="font-medium">Clear</span>
          </button>

          <button
            onClick={preOrderCount > 0 ? onPreOrderCountClick : undefined}
            className={`flex-1 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 ${
              preOrderCount > 0 
                ? "bg-blue-50 text-blue-700 hover:bg-blue-100" 
                : "bg-gray-50 text-gray-400 cursor-not-allowed"
            }`}
            disabled={preOrderCount === 0}
          >
            <span className="font-medium">View Order</span>
            {preOrderCount > 0 && (
              <div className="bg-blue-700 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {preOrderCount}
              </div>
            )}
          </button>

          <button
            onClick={handleCheckout}
            className={`px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${
              preOrderCount > 0 
                ? "bg-primary text-white hover:bg-primary/90" 
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={preOrderCount === 0}
          >
            <span>Checkout</span>
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingButtons;