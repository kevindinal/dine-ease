import { db } from "@/lib/firebase";
import { collection, doc, setDoc, updateDoc, arrayUnion, serverTimestamp, getDoc, getDocs, query, limit, or } from "firebase/firestore";
import { Order, UserOrder } from "../types/order";
import { PreOrderItem } from "@/app/(cuisine)/types/preOrderTypes";
import { create } from "domain";

const collectionExists = async (collectionName: string): Promise<boolean> => {
    try {
        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(query(collectionRef, limit(1)));
        return true;
    } catch (error) {
        console.log(`Error checking if collection exists: ${error}`);
        return false;
    }
};

export const createOrder = async (userId: string, amount: number, paymentIntentId: string, items: PreOrderItem[]): Promise<string> => {
    try {
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
        const timeStamp = Date.now();

        const orderData: Order = {
            id: orderId,
            userId,
            amount,
            status: 'pending',
            createdAt: timeStamp,
            items,
            isTableReady: false,
            isMealReady: false,
            isReservationReady: false
        };

        const itemCount = items.reduce((count, item) => count + item.quantity, 0);

        const userOrderData: UserOrder = {
            orderId,
            amount,
            status: 'pending',
            createdAt: timeStamp,
            itemCount,
            isTableReady: false,
            isMealReady: false,
            isReservationReady: false
        }

        await setDoc(doc(db, 'orders', orderId), orderData);

        const userOrderRef = doc(db, 'users', userId);

        const userDoc = await getDoc(userOrderRef);

        if (userDoc.exists()) {
            await updateDoc(userOrderRef, {
                orders: arrayUnion(userOrderData)
            });
        } else {
            await setDoc(userOrderRef, {
                userId,
                orders: [userOrderData],
                createdAt: timeStamp
            })
        }
        return orderId;
    } catch (error) {
        console.log(`Error creating order: ${error}`);
        throw new Error('Error creating order');  
    }
};

export const ensureCollectionsExist = async (): Promise<void> => {
    try {
        const orderExists = await collectionExists('orders');

        if (!orderExists) {
            const setUpDocRef = doc(db, 'orders', 'setup');
            await setDoc(setUpDocRef, {
                setup: true,
                createdAt: serverTimestamp(),
                note: 'Thi document was created to initialize the orders collection'
            });
            console.log('Order collection created successfully');
        }
    } catch (error) {
        console.error(`Error ensuring collections exist: ${error}`);
    }
};