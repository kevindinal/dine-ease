import React, { FC } from "react";
import { XCircle } from "lucide-react";
import { PreOrderItem } from "../types/preOrderTypes";

interface PreOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  preOrders: PreOrderItem[];
  removeItem: (itemId: string, customizations: string) => void;
}

const PreOrderModal: FC<PreOrderModalProps> = ({ isOpen, onClose, preOrders, removeItem }) => {
  if (!isOpen) return null;

  const getItemCustomizationKey = (item: PreOrderItem) => {
    const addOnsString = Array.isArray(item.addOns) 
      ? item.addOns.join(",") 
      : (typeof item.addOns === 'string' ? item.addOns : "");
    
    return `${item.ingredients || ""}-${item.portionSize || ""}-${item.spiceLevel || ""}-${item.drinkPairing || ""}-${addOnsString}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Pre-Order Items</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle size={24} />
          </button>
        </div>
        
        {preOrders.length === 0 ? (
          <p className="text-center text-gray-500 my-8">Your pre-order is empty</p>
        ) : (
          <div className="space-y-4">
            {preOrders.map((item) => (
              <div key={`${item.id}-${getItemCustomizationKey(item)}`} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center">
                  <img 
                    src={item.image || "/api/placeholder/40/40"} 
                    alt={item.name} 
                    className="w-10 h-10 rounded object-cover mr-3"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-4">${item.price.toFixed(2)}</span>
                  <button 
                    onClick={() => removeItem(item.id, getItemCustomizationKey(item))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="mt-4 pt-2 border-t flex justify-between font-bold">
              <span>Total:</span>
              <span>
                ${preOrders.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreOrderModal;