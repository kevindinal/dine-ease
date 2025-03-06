import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

type Reservation = {
  date: string;
  time: string;
  guests: string;
  table: string;
};

const useReservation = (userId: string) => {
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const q = query(
          collection(db, "reservations"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setReservation({
            date: data.date,
            time: data.time,
            guests: data.guests,
            table: data.table,
          });
        }
      } catch (error) {
        console.error("Error fetching reservation:", error);
      }
    };

    fetchReservation();
  }, [userId]);

  return reservation;
};

export default useReservation;
