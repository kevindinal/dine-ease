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

/** 
 * useEffect hook to synchronize the `preOrders` state with localStorage.
 * - Whenever the `preOrders` state changes, the updated value is saved in the browser's localStorage.
 * - This ensures that pre-order data persists across page reloads, making it available for the next session.
 * 
 * Dependencies:
 * - `preOrders`: The effect will re-run every time `preOrders` changes.
 */
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preOrders", JSON.stringify(preOrders));
    }
  }, [preOrders]);

  const preOrderCount = preOrders.reduce((total, item) => total + item.quantity, 0);

/** 
 * Generates a unique identifier for a pre-order item based on its properties.
 * - The function combines the item's `id`, `portionSize`, `spiceLevel`, `drinkPairing`, and `addOns` 
 *   (if present) to create a string that uniquely identifies the item.
 * - The result is a string formatted as: "item.id-portionSize-spiceLevel-drinkPairing-addOns".
 */  
  const generateUniqueId = (item: PreOrder): string => {
    const addOnsString = Array.isArray(item.addOns) 
      ? item.addOns.join(",") 
      : (typeof item.addOns === 'string' ? item.addOns : "");
    
    return `${item.id}-${item.portionSize || ""}-${item.spiceLevel || ""}-${item.drinkPairing || ""}-${addOnsString}`;
  };

  /** 
 * Function to add a new item to the pre-order list or update the quantity of an existing item.
 * - Checks if an item with the same unique ID already exists in the pre-orders list.
 * - If an existing item is found, it increments its quantity by the quantity of the new item.
 * - If the item is not found, it adds the new item to the list with a generated unique ID.
 */
  const addItemToPreOrder = (newItem: PreOrder) => {
    setPreOrders((prevItems) => {
      const uniqueId = generateUniqueId(newItem);
      
      const existingItemIndex = prevItems.findIndex(item => 
        generateUniqueId(item) === uniqueId
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        return [...prevItems, {
          ...newItem,
          uniqueId
        }];
      }
    });
  };

  /** 
 * Function to remove an item from the pre-order list by its unique identifier or ID.
 * - Filters out the item from the list that matches the provided itemId.
 * - It checks for both `uniqueId` or `id` to ensure compatibility with different structures.
 */
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