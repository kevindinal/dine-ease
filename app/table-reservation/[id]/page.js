"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter
import { db, storage } from "../../../lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { PiSeatFill } from "react-icons/pi";
import { MdOutlineFireplace } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";
import "../tableReservation.css"; // Reuse styles
import { useParams } from "next/navigation";

import { FaBed } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa";
import { FaSignsPost } from "react-icons/fa6";
import { FaMoneyBill } from "react-icons/fa";
import dynamic from "next/dynamic";

const ThreeSixtyViewer = dynamic(() => import("../thresixty"), {
  ssr: false, // Disable server-side rendering
});

const TableDetails = () => {
  const { id } = useParams();
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // ✅ For navigation

  useEffect(() => {
    if (!id) {
      console.error("ID is undefined");
      return;
    }

    console.log("Fetching table for ID:", id);

    const fetchTable = async () => {
      setLoading(true);

      try {
        const tableRef = doc(db, "tables", id);
        const tableSnap = await getDoc(tableRef);

        if (tableSnap.exists()) {
          let tableData = tableSnap.data();
          let imageUrl = tableData.imageUrl;

          console.log("Table found:", tableData);

          if (imageUrl && !imageUrl.startsWith("http")) {
            try {
              const storageRef = ref(storage, imageUrl);
              imageUrl = await getDownloadURL(storageRef);
              console.log("Fetched image URL:", imageUrl);
            } catch (error) {
              console.error("Error fetching image URL:", error);
            }
          }

          setTable({ id, ...tableData, imageUrl });
        } else {
          console.error("Table not found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching table:", error);
      }

      setLoading(false);
    };

    fetchTable();
  }, [id]);

  if (loading)
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  if (!table) return <div className="error">Table not found</div>;

  return (
    <div className="container pt-3 pb-4">
      <button className="btn btn-secondary mb-3" onClick={() => router.back()}>
        ← Back
      </button>

      <div className="table-info-space mt-5">
        <div className="container mb-5">
          <div className="row">
            <div className="col-12 ">
              <div className="image-slider-space">
                {table.imageUrl && (
                  <>
                    <ThreeSixtyViewer imageUrl="/ff.jpg" />
                    {/* <img
                      src={table.imageUrl}
                      alt={table.name}
                      className="table-image"
                      style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "8px",
                        objectFit: "cover",
                        marginRight: "15px",
                      }}
                    /> */}
                  </>
                )}
              </div>
            </div>
            <div className="col-12 col-lg-6 mt-4 mt-lg-0">
              <div className="table-details-space">
                <div className="col-12">
                  <h3>{table.name}</h3>
                </div>
                <div className="col-12">
                  <p className="text-align-justify">{table.description}</p>
                  <p>
                    <FaMoneyBill className="me-3" />
                    hi
                    <i className="bi bi-currency-dollar"></i>
                  </p>
                  <p>
                    <FaPhoneAlt className="me-3" />
                    049239293294
                  </p>
                  <p>
                    <FaLocationArrow className="me-3" />
                    {table.location}
                  </p>
                  <p>
                    <FaSignsPost className="me-3" />
                    34w332
                  </p>
                </div>
                <div className="col-12 mt-4">
                  <div className="row">
                    <div className="col-12 col-lg-4">
                      <div className="small-info">
                        <i className="bi bi-columns-gap"></i>
                        <p
                          style={{
                            color:
                              table.status &&
                              table.status.toLowerCase() === "available"
                                ? "#4bd010"
                                : "red",
                          }}
                          className="status-tag"
                        >
                          {table.status
                            ? table.status.charAt(0).toUpperCase() +
                              table.status.slice(1)
                            : "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className="col-12 col-lg-4 mt-2 mt-lg-0">
                      <div className="small-info">
                        <FaBed />3
                      </div>
                    </div>

                    <div className="col-12 col-lg-4 mt-2 mt-lg-0">
                      <div className="small-info">
                        <i className="bi bi-currency-dollar "></i>
                        fdfdf
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*       
      <div className="table-details-container">
        {table.imageUrl && (
          <img
            src={table.imageUrl}
            alt={table.name}
            className="table-image"
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "8px",
              objectFit: "cover",
              marginRight: "15px",
            }}
          />
        )}

        <div className="table-details">
          <h2>{table.name}</h2>
          <div className="table-info">
            <PiSeatFill className="r-icon" />
            <p className="tb-information">{table.seats} Seats</p>
          </div>
          <div className="table-info">
            <MdOutlineFireplace className="r-icon" />
            <p className="tb-information">{table.location}</p>
          </div>
          <div className="table-info">
            <IoMdInformationCircle className="r-icon" />
            <p className="tb-information">{table.description}</p>
          </div>
          <p
            style={{
              color:
                table.status && table.status.toLowerCase() === "available"
                  ? "#4bd010"
                  : "red",
            }}
            className="status-tag"
          >
            {table.status
              ? table.status.charAt(0).toUpperCase() + table.status.slice(1)
              : "Unknown"}
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default TableDetails;
