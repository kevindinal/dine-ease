import { useEffect, useState } from "react";

interface PreOrderItem {
  id: number;
  name: string;
  quantity: number;
  ingredients: string[];
  plating: string;
  cookingMethod: string;
  seasonalSelection: boolean;
  drinkPairing: string;
  price: number;
  image: string;
}

export default function usePreOrder() {
  const [preOrders, setPreOrders] = useState<PreOrderItem[]>([]);

  // Load pre-orders from localStorage on initial load
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('preOrders') || '[]');
    setPreOrders(storedOrders);
  }, []);

  // Save pre-orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('preOrders', JSON.stringify(preOrders));
  }, [preOrders]);

  // Add item to pre-order or update existing item
  const addItemToPreOrder = (item: PreOrderItem) => {
    setPreOrders((prevOrders) => {
      const existingItemIndex = prevOrders.findIndex(
        (order) =>
          order.id === item.id &&
          JSON.stringify(order.ingredients) === JSON.stringify(item.ingredients) &&
          order.plating === item.plating &&
          order.cookingMethod === item.cookingMethod &&
          order.seasonalSelection === item.seasonalSelection &&
          order.drinkPairing === item.drinkPairing
      );

      if (existingItemIndex !== -1) {
        // Item already exists, so update quantity
        const updatedOrders = [...prevOrders];
        updatedOrders[existingItemIndex].quantity += item.quantity;
        return updatedOrders;
      }

      // Item doesn't exist, so add new item
      return [...prevOrders, item];
    });
  };

  // Clear pre-orders from state and localStorage
  const clearPreOrder = () => {
    setPreOrders([]);
    localStorage.removeItem('preOrders');
  };

  return { 
    preOrders, 
    preOrderCount: preOrders.reduce((total, item) => total + item.quantity, 0), 
    addItemToPreOrder, 
    clearPreOrder 
  };
}
