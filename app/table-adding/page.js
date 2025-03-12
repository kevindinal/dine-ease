"use client";

import Modal from "react-bootstrap/Modal"; // Import Bootstrap Modal
import Button from "react-bootstrap/Button"; // Import Bootstrap Button
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
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";

import { GrLocationPin } from "react-icons/gr";
import { PiArmchairFill } from "react-icons/pi";


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
  const [showImagePreview, setShowImagePreview] = useState(false);

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

  const formRef = useRef(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setShowImagePreview(true); // Show modal when image is selected
    }
  };
  const handleDeleteTable = (tableId) => {
    setTableToDelete(tableId);
    setShowDeleteModal(true);
  };

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

  console.log(selectedTable);
  return (
    <div className="container pt-3 pb-4">
      <div className="row">
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
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={() => document.getElementById("cameraInput").click()}
              >
                Take a Photo
              </button>
              <input
                type="file"
                id="cameraInput"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={handleImageChange}
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
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : (
              tables.map((table) => (
                <div
                  className="table-item"
                  key={table.id}
                  onClick={() => handleTableClick(table)}
                >
                  <h2>{table.name}</h2>
                  <div className="table-d">
                    <PiArmchairFill  />
                    <p>{table.seats}</p>
                  </div>

                  <div className="table-d">
                    <GrLocationPin  />
                    <p>{table.location}</p>
                  </div>
                  <div
                      className={
                        table.status &&
                        table.status.toLowerCase() === "available"
                          ? "status-tag-holder"
                          : table.status &&
                            table.status.toLowerCase() === "reserved"
                          ? "status-tag-holder-r"
                          : ""
                      }
                    >
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
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTable(table.id);
                      }}
                      disabled={loading}
                    >
                      <MdDeleteOutline />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal
        show={showImagePreview}
        onHide={() => setShowImagePreview(false)}
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="text-center px-0 py-0">
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "cover",
              }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowImagePreview(false)}
          >
            Cancel
          </Button>
          <Button
            className="btn-confirm"
            onClick={() => setShowImagePreview(false)}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

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
                    {selectedTable.imageUrl && (
                      <img
                        src={selectedTable.imageUrl}
                        alt="Table"
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
