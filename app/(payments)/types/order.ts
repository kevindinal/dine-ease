import { PreOrderItem } from "@/app/(cuisine)/types/preOrderTypes";

export interface Order {
    id: string;
    userId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    createdAt: number;
    items: PreOrderItem[];
    isTableReady: boolean;
    isMealReady: boolean;
    isReservationReady: boolean;
}

export interface UserOrder {
    orderId: string;
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: number;
    itemCount: number;
    isTableReady: boolean;
    isMealReady: boolean;
    isReservationReady: boolean;
}