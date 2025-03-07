"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase/config";
import {
  collection,
  getDocs
  
} from "firebase/firestore";
import "./tableReservation.css";
import { PiSeatFill } from "react-icons/pi";
import { MdOutlineFireplace } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";



const TableReservation = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for managing modals
  const [selectedTable, setSelectedTable] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleTableClick = (table) => {
    setSelectedTable(table);
    setShowDetailsModal(true);
  };

  // Fetch Tables from Firestore
  useEffect(() => {
    let isMounted = true; // Flag to check if component is mounted
    const fetchTables = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "tables"));
      if (isMounted) {
        setTables(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
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
      <div className="row">
        {/* Tables Section */}
        <div className="col-lg-12 col-md-12 col-12 pt-0 pt-lg-4 pt-md-4">
          <div className="tables-container">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              tables.map((table) => (
                <div
                  className="table-item"
                  key={table.id}
                  onClick={() => handleTableClick(table)}
                >
                  <h2>{table.name}</h2>
                  <p>Seats: {table.seats}</p>
                  <p>Location: {table.location}</p>
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

                  {table.imgUrl && (
                    <img
                      src={table.imageUrl}
                      alt="Table"
                      className="table-image"
                      width="150"
                    />
                  )}
                  
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    
      {showDetailsModal && selectedTable && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div
            className="modal fade show"
            tabIndex="-1"
            style={{ display: "block" }}
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedTable.name}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDetailsModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="table-details-container">
                    {/* Image on the left side */}
                    {selectedTable.imgUrl && (
                      <img
                        src={`${process.env.PUBLIC_URL}/hilton.png`} 
                        alt={selectedTable.name}
                        className="table-image"
                        style={{
                          width: "150px",
                          height: "150px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          marginRight: "15px",
                        }}
                      />
                    )}

                    {/* Table information on the right */}
                    <div className="table-details">
                      <div className="table-info">
                        <PiSeatFill className="r-icon" />
                        <p className="tb-information">
                          {selectedTable.seats} Seats
                        </p>
                      </div>
                      <div className="table-info">
                        <MdOutlineFireplace className="r-icon" />
                        <p className="tb-information">
                          {selectedTable.location}
                        </p>
                      </div>
                      <div className="table-info">
                        <IoMdInformationCircle className="r-icon" />
                        <p className="tb-information">
                          {selectedTable.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TableReservation;
