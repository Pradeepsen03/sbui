"use client";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap";
import DataTableComponent from "../../../components/DataTableComponent";
import PaginationComponent from "../../../components/PaginateComponente";
import ChartsComponent from "../../../components/ChartsComponent";
import SearchExportComponent from "../../../components/SearchExportComponent";
import {
  data,
  stockChartOptions,
  budgetChartOptions,
  stockCount,
  budgetChartData,
  ClientChartOptions,
  clientChartData,
  EquipmentChartOptions,
  CallProjectChartOptions,
  callProjectChartData,
  getEquipmentChartOptions,
} from "../../../utils";
import "../../../styles/dataTable.css";
import { MdOutlineEdit } from "react-icons/md";
import { statusBadge } from "/utils.js";
import Link from "next/link";

const TableComponent = () => {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [equipments, setEquipments] = useState([]);
  const [equipmentId, setEquipmentId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [crewMembers, setCrewMembers] = useState([]);
  const [equipmentChartData, setChatEquipmentData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    streetAddress: "",
    streetAddress2: "",
    city: "",
    state: "",
    zip: "",
    crewMemberId: "",
  });

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setFormData({
      name: "",
      type: "",
      location: "",
      streetAddress: "",
      streetAddress2: "",
      city: "",
      state: "",
      zip: "",
      crewMemberId: "",
    });
    setErrors({});
  };

  const handleShowEditModal = (row) => {
    console.log("rrr", row);
    setFormData({
      id: row.id,
      name: row.name || "",
      type: row.type || "",
      location: row.location || "",
      streetAddress: row.streetAddress || "",
      streetAddress2: row.streetAddress2 || "",
      city: row.city || "",
      state: row.state || "",
      zip: row.zip || "",
      crewMemberId: row.crewMemberId || "",
    });

    setEquipmentId(row.id);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => setShowEditModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    if (!value) {
      errorMsg = "This field is required";
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  const handleEditSubmit = async () => {
    if (!formData.id) {
      console.error("Missing equipment ID");
      return;
    }

    try {
      setIsUpdating(true);

      const response = await fetch(`/api/editEquipment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Update Successful:", result);
        await fetchEquipments();
        handleCloseEditModal();
      } else {
        console.error("Update Failed:", result.error);
      }
    } catch (error) {
      console.error("Error updating equipment:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const rowsPerPage = 5;



  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const [crewMembersRes] = await Promise.all([
          fetch("/api/getCrewMembers"),
        ]);

        const [crewMembersData] = await Promise.all([crewMembersRes.json()]);

        setCrewMembers(crewMembersData.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    }

    fetchDropdownData();
  }, []);

  const fetchEquipments = async () => {
    try {
      setIsGlobalLoading(true);
      const response = await fetch("/api/getEquipment");
      const result = await response.json();
      console.log("dhhh", result.data);
      setEquipments(result.data || []);
      transformEquipmentData(result.data);
    } catch (error) {
      console.error("Error fetching equipments:", error);
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const transformEquipmentData = (apiData) => {
    // Create an object to store the count of each type
    const equipmentCounts = {};

    // Iterate through the API data
    apiData.forEach((item) => {
      const type = item.type;

      // If the type already exists in the object, increment the count
      if (equipmentCounts[type]) {
        equipmentCounts[type]++;
      } else {
        // Otherwise, initialize the count to 1
        equipmentCounts[type] = 1;
      }
    });

    // Convert the object into an array of { type, count } objects
    const transformedData = Object.keys(equipmentCounts).map((type) => ({
      type,
      count: equipmentCounts[type],
    }));
    setChatEquipmentData(transformedData);
    return transformedData;
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const filteredData = equipments.filter(
    (item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.type.toLowerCase().includes(filterText.toLowerCase()) ||
      item.location.toLowerCase().includes(filterText.toLowerCase()) ||
      (item.streetAddress &&
        item.streetAddress.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.city &&
        item.city.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.state &&
        item.state.toLowerCase().includes(filterText.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "70px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "130px",
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
      width: "130px",
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
      width: "150px",
    },
    {
      name: "Street Address",
      selector: (row) => row.streetAddress || "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "Street Address 2",
      selector: (row) => row.streetAddress2 || "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "City",
      selector: (row) => row.city || "N/A",
      sortable: true,
      width: "120px",
    },
    {
      name: "State",
      selector: (row) => row.state || "N/A",
      sortable: true,
      width: "100px",
    },
    {
      name: "ZIP Code",
      selector: (row) => row.zip || "N/A",
      sortable: true,
      width: "112px",
    },
    {
      name: "Crew Member",
      selector: (row) =>
        row.crewMember.firstName + " " + row.crewMember.lastName || "N/A",
      sortable: true,
      width: "160px",
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
      width: "150px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => handleShowEditModal(row)}
          className="btn btn-sm btn-primary"
        >
          <MdOutlineEdit size={16} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "100px",
    },
  ];

  console.log("fhhfhc", equipmentChartData);

  return (
    <>
      {isGlobalLoading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          <Row>
            <Col lg={12} md={12} xs={12}>
              <div className="border-bottom pb-4 mb-4 mt-4 ms-4 ">
                <h3 className="mb-0 fw-bold">Equipments</h3>
              </div>
            </Col>
          </Row>

          <div className="d-flex justify-content-center flex-wrap mt-5 gap-3 mb-8 ms-3 me-3">
            <ChartsComponent
              type="bar"
              options={getEquipmentChartOptions(equipmentChartData)} // Pass dynamic options
              series={[{ data: equipmentChartData.map((item) => item.count) }]}
              width="100%"
              height="300"
              containerStyle={{ flex: "0 0 100%" }}
              containerClassname="p-3 bg-white rounded shadow"
              title="Equipment Count by Type"
            />
          </div>

          <Row className="mt-5 ms-3 me-4 g-0">
            <SearchExportComponent
              filterText={filterText}
              setFilterText={setFilterText}
              data={filteredData}
              link="/equipments/addEquipment"
              buttonText="Add Equipment"
            />
            <DataTableComponent
              paginatedData={paginatedData}
              isLoading={isGlobalLoading}
              columns={columns}
              handleShowEditModal={handleShowEditModal}
            />
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </Row>

          {/* Edit Modal */}
          <Modal
            show={showEditModal}
            onHide={handleCloseEditModal}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Equipment</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Type</Form.Label>
                      <Form.Control
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                 
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Crew Member </Form.Label>
                      <Form.Control
                        as="select"
                        name="crewMemberId"
                        value={formData.crewMemberId}
                        onChange={handleChange}
                      >
                        <option value="">Select Crew Member</option>
                        {crewMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.fullName}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Street Address 1</Form.Label>
                      <Form.Control
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Street Address 2</Form.Label>
                      <Form.Control
                        type="text"
                        name="streetAddress2"
                        value={formData.streetAddress2}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>ZIP Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEditModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleEditSubmit}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default TableComponent;
