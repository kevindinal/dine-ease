import { useState, useEffect } from "react";

export interface PreOrder {
  id: string;
  name: string;
  quantity: number;
  ingredients: string;
  portionSize: string;
  spiceLevel: string;
  drinkPairing: string;
  price: number;
  image: string;
  addOns?: any[];
  // Add uniqueId for item identification
  uniqueId?: string;
}

const usePreOrder = () => {
  const [preOrders, setPreOrders] = useState<PreOrder[]>(() => {
    if (typeof window !== "undefined") {
      const savedPreOrders = localStorage.getItem("preOrders");
      return savedPreOrders ? JSON.parse(savedPreOrders) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preOrders", JSON.stringify(preOrders));
    }
  }, [preOrders]);

  const preOrderCount = preOrders.reduce((total, item) => total + item.quantity, 0);

  const generateUniqueId = (item: PreOrder): string => {
    // Create a consistent unique identifier based on the item and its customizations
    const addOnsString = Array.isArray(item.addOns) 
      ? item.addOns.join(",") 
      : (typeof item.addOns === 'string' ? item.addOns : "");
    
    return `${item.id}-${item.portionSize || ""}-${item.spiceLevel || ""}-${item.drinkPairing || ""}-${addOnsString}`;
  };

  const addItemToPreOrder = (newItem: PreOrder) => {
    setPreOrders((prevItems) => {
      // Generate a unique ID for this specific item with its customizations
      const uniqueId = generateUniqueId(newItem);
      
      const existingItemIndex = prevItems.findIndex(item => 
        generateUniqueId(item) === uniqueId
      );

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        // Add new item with the uniqueId
        return [...prevItems, {
          ...newItem,
          uniqueId
        }];
      }
    });
  };

  // Remove item by uniqueId or regular id 
  const removePreOrderItem = (itemId: string) => {
    setPreOrders((prevItems) => prevItems.filter(item => 
      (item.uniqueId || item.id) !== itemId
    ));
  };

  const clearPreOrder = () => {
    setPreOrders([]);
  };

  return {
    preOrders,
    preOrderCount,
    addItemToPreOrder,
    removePreOrderItem,
    clearPreOrder,
  };
};

export default usePreOrder;