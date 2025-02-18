import { useEffect, useState } from "react";

interface PreOrderItem {
  id: string;
  name: string;
  quantity: number;
  ingredients: string;
  portionSize: string;
  spiceLevel: string;
  drinkPairing: string;
  addOns: string[];
  price: number;
  image: string;
}

export default function usePreOrder() {
  const [preOrders, setPreOrders] = useState<PreOrderItem[]>([]);

  // Initialize preOrders from localStorage
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("preOrders") || "[]");
    setPreOrders(storedOrders);
  }, []);

  // Sync the preOrders state to localStorage whenever it changes
  useEffect(() => {
    if (preOrders.length > 0) {
      localStorage.setItem("preOrders", JSON.stringify(preOrders));
    }
  }, [preOrders]);

  const addItemToPreOrder = (item: PreOrderItem) => {
    setPreOrders((prevOrders) => {
      const existingItemIndex = prevOrders.findIndex(
        (order) =>
          order.id === item.id &&
          order.ingredients === item.ingredients &&
          order.portionSize === item.portionSize &&
          order.spiceLevel === item.spiceLevel &&
          order.addOns.join(",") === item.addOns.join(",") &&
          order.drinkPairing === item.drinkPairing
      );
  
      if (existingItemIndex !== -1) {
        const updatedOrders = [...prevOrders];
        updatedOrders[existingItemIndex].quantity += item.quantity;
        return updatedOrders;
      }
  
      return [...prevOrders, item];
    });
  };
  

  const clearPreOrder = () => {
    setPreOrders([]);
    localStorage.removeItem("preOrders");
  };

  return {
    preOrders,
    preOrderCount: preOrders.reduce((total, item) => total + item.quantity, 0),
    addItemToPreOrder,
    clearPreOrder,
  };
}
