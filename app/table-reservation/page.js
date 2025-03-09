"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation"; // ✅ Import useRouter for navigation
import { ref, getDownloadURL } from "firebase/storage"; // ✅ Import Firebase Storage
import { storage } from "../../lib/firebase/config"; // ✅ Import storage
import "./tableReservation.css";
import { PiArmchairFill } from "react-icons/pi";

const TableReservation = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // ✅ Use router for navigation

  // Fetch Tables from Firestore
  useEffect(() => {
    let isMounted = true;

    const fetchTables = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "tables"));

      const tablesData = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let imageUrl = data.imageUrl;

          if (imageUrl && !imageUrl.startsWith("http")) {
            try {
              const storageRef = ref(storage, imageUrl);
              imageUrl = await getDownloadURL(storageRef);
            } catch (error) {
              console.error("Error fetching image URL: ", error);
            }
          }

          return { id: docSnap.id, ...data, imageUrl };
        })
      );

      if (isMounted) {
        setTables(tablesData);
        setLoading(false);
      }
    };

    fetchTables();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container pt-3 pb-4">
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-12 col-md-12 col-12 pt-0 pt-lg-4 pt-md-4">
            <div className="tables-container">
              {tables.map((table) => (
                <div
                  className="table-item"
                  key={table.id}
                  onClick={() => router.push(`/table-reservation/${table.id}`)}
                >
                  <div className="table">
                    <h2 className="mb-1">{table.name}</h2>
                    <p className="mb-1">{table.location}</p>
                    <p
                      style={{
                        color:
                          table.status &&
                          table.status.toLowerCase() === "available"
                            ? "#4bd010"
                            : "red",
                      }}
                      className="status-tag mb-4"
                    >
                      {table.status
                        ? table.status.charAt(0).toUpperCase() +
                          table.status.slice(1)
                        : "Unknown"}
                    </p>

                    <div className="seats">
                      {Array.from({ length: table.seats || 0 }).map((_, index) => (
                        <div key={index} className="seat">
                          <PiArmchairFill className="r-icon" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableReservation;
