"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect, useRef } from "react";
import { db, storage } from "../../lib/firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./tableAddingStyles.css";
import { PiSeatFill } from "react-icons/pi";
import { MdOutlineFireplace } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";



const SeatingPlanEditor = () => {
  const [tables, setTables] = useState([]);
  const [tableData, setTableData] = useState({
    name: "",
    seats: "",
    location: "",
    imageUrl: "",
    description: "",
  });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingTableId, setEditingTableId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // State for managing modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tableToEdit, setTableToEdit] = useState(null);
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

  const formRef = useRef(null);

  // Handle Image Upload
  const uploadImage = async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `table-images/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSaveTable = async () => {
    if (!tableData.name || !tableData.seats || !tableData.location) {
      setFormError("Please fill in all fields");
      return;
    }
    setFormError("");
    setLoading(true);

    let uploadedImageUrl = tableData.imageUrl;
    if (imageFile) {
      uploadedImageUrl = await uploadImage(imageFile);
    }

    if (editingTableId) {
      // Update existing table
      const tableRef = doc(db, "tables", editingTableId);
      await updateDoc(tableRef, { ...tableData, imageUrl: uploadedImageUrl });
      setTables((prevTables) =>
        prevTables.map((table) =>
          table.id === editingTableId
            ? { ...table, ...tableData, imageUrl: uploadedImageUrl }
            : table
        )
      );
      setEditingTableId(null);
    } else {
      // Add new table
      const newTableRef = await addDoc(collection(db, "tables"), {
        ...tableData,
        imageUrl: uploadedImageUrl,
        status: "available",
        createdAt: new Date(),
      });
      setTables([
        ...tables,
        { id: newTableRef.id, ...tableData, imageUrl: uploadedImageUrl },
      ]);
    }

    setTableData({
      name: "",
      seats: "",
      location: "",
      imageUrl: "",
      description: "",
    }); // Reset form
    setImageFile(null);
    setLoading(false);
  };

  // Function to show the delete confirmation modal
  const handleDeleteTable = (tableId) => {
    setTableToDelete(tableId);
    setShowDeleteModal(true);
  };

  // Function to confirm deletion
  const confirmDeleteTable = async () => {
    if (tableToDelete) {
      setLoading(true);
      const tableRef = doc(db, "tables", tableToDelete);
      await deleteDoc(tableRef);
      setTables(tables.filter((table) => table.id !== tableToDelete));
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  // Handle Edit Modal
  const handleEditTable = (table) => {
    setTableToEdit(table);
    setShowEditModal(true);
  };

  const confirmEditTable = () => {
    setTableData({
      name: tableToEdit.name,
      seats: tableToEdit.seats,
      location: tableToEdit.location,
      imageUrl: tableToEdit.imageUrl || "",
      description: tableToEdit.description || "",
    });
    setEditingTableId(tableToEdit.id);
    setShowEditModal(false);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  console.log(tables)
  return (
    <div className="container pt-3 pb-4">
      <div className="row">
        {/* Form Section */}
        <div ref={formRef} className="col-lg-4 col-md-5 col-12">
          <div className="form-container mb-2 mb-lg-0">
            <h1>{editingTableId ? "Edit Table" : "Add Your Seating Plan"}</h1>
            {formError && <p className="error-message">{formError}</p>}
            <form>
              <input
                type="text"
                placeholder="Table Name"
                value={tableData.name}
                onChange={(e) =>
                  setTableData({ ...tableData, name: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Seats"
                value={tableData.seats}
                onChange={(e) =>
                  setTableData({ ...tableData, seats: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Location"
                value={tableData.location}
                onChange={(e) =>
                  setTableData({ ...tableData, location: e.target.value })
                }
              />
              <textarea
                type="text"
                placeholder="Description"
                value={tableData.description}
                onChange={(e) =>
                  setTableData({ ...tableData, description: e.target.value })
                }
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <button
                type="button"
                onClick={handleSaveTable}
                disabled={loading}
              >
                {editingTableId ? "Update Table" : "Add Table"}
              </button>
            </form>
          </div>
        </div>

        {/* Tables Section */}
        <div className="col-lg-8 col-md-7 col-12 pt-0 pt-lg-4 pt-md-4">
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

                  {/* {table.imgUrl && (
                    <img
                      src={table.imageUrl}
                      alt="Table"
                      className="table-image"
                      width="150"
                    />
                  )} */}
                  <div className="button-group">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTable(table);
                      }}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTable(table.id);
                      }}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this table?</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-del" onClick={confirmDeleteTable}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Confirmation Modal */}
      {showEditModal && (
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
                  <h5 className="modal-title">Confirm Edit</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to edit this table?</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-confirm"
                    onClick={confirmEditTable}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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

export default SeatingPlanEditor;
