

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase"; // Firebase instance
import { doc, collection, addDoc } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { date, time, guests, table, uid } = req.body; // Use 'uid' instead of 'userId'

      if (!uid) {
        return res.status(400).json({ success: false, error: "User ID (uid) is required" });
      }

      // Reference to the specific user's document
      const userRef = doc(db, "users", uid); 
      
      // Create an "orders" subcollection inside the user's document
      const orderRef = collection(userRef, "orders");

      // Save order data inside the user's "orders" subcollection
      const docRef = await addDoc(orderRef, {
        date,
        time,
        guests,
        table,
        createdAt: new Date(),
      });

      res.status(200).json({ success: true, orderId: docRef.id });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
