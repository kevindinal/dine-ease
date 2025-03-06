import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase"; // Import Firebase instance
import { collection, addDoc } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { date, time, guests, table, userId } = req.body;

      const docRef = await addDoc(collection(db, "reservations"), {
        userId,
        date,
        time,
        guests,
        table,
        createdAt: new Date(),
      });

      res.status(200).json({ success: true, id: docRef.id });
    } catch (error) {
      // Type casting the error to a known type (Error)
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
