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

  const addItemToPreOrder = (newItem: PreOrder) => {
    setPreOrders((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => 
          item.id === newItem.id &&
          item.portionSize === newItem.portionSize &&
          item.spiceLevel === newItem.spiceLevel &&
          item.drinkPairing === newItem.drinkPairing &&
          item.image === newItem.image &&
          JSON.stringify(item.addOns) === JSON.stringify(newItem.addOns)
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        return [...prevItems, newItem];
      }
    });
  };

  const removePreOrderItem = (itemId: string) => {
    setPreOrders((prevItems) => prevItems.filter((item) => item.id !== itemId));
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