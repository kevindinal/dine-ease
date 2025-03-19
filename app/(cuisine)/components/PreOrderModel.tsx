import React, { FC } from "react";
import { XCircle, ShoppingBag, Trash2 } from "lucide-react";
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

  const totalAmount = preOrders.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="flex items-center">
            <ShoppingBag className="text-green-600 mr-2" size={24} />
            <h2 className="text-xl font-bold">Your Pre-Order</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <XCircle size={24} />
          </button>
        </div>
        
        {preOrders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 mb-2">Your pre-order is empty</p>
            <p className="text-sm text-gray-400">Add items to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-2 text-sm font-medium text-gray-500">
              {preOrders.length} {preOrders.length === 1 ? 'item' : 'items'}
            </div>
            
            {preOrders.map((item) => {
              const customizationKey = getItemCustomizationKey(item);
              const hasCustomizations = customizationKey.replace(/-/g, '').length > 0;
              
              return (
                <div 
                  key={`${item.id}-${customizationKey}`} 
                  className="flex items-start justify-between border-b pb-4"
                >
                  <div className="flex">
                    <img 
                      src={item.image || "/api/placeholder/48/48"} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-md object-cover mr-3"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      
                      {hasCustomizations && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.portionSize && <span className="mr-1">{item.portionSize} •</span>}
                          {item.spiceLevel && <span className="mr-1">{item.spiceLevel} •</span>}
                          {item.ingredients && <span className="mr-1">{item.ingredients}</span>}
                          {item.addOns && (
                            <span className="block mt-1">
                              + {Array.isArray(item.addOns) ? item.addOns.join(", ") : item.addOns}
                            </span>
                          )}
                        </p>
                      )}
                      
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    <button 
                      onClick={() => removeItem(item.id, customizationKey)}
                      className="text-red-500 hover:text-red-700 mt-2 flex items-center text-sm"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} className="mr-1" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
          
          {preOrders.length > 0 && (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreOrderModal;