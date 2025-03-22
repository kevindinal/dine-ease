export interface PreOrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    ingredients: string;
    portionSize: string;
    spiceLevel: string;
    drinkPairing: string;
    addOns?: any[];
    uniqueId?: string;
  }