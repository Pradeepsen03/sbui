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
  equipmentChartData,
  EquipmentChartOptions,
  CallProjectChartOptions,
  callProjectChartData,
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
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState(null); // Add this line
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [prodCompany, setProdCompany] = useState([]);
  const [prodManager, setProdManager] = useState([]);
  const [client, setClient] = useState([]);

  const [formData, setFormData] = useState({
    projectId: "", // Add projectId to the state
    projectManager: "",
    projectName: "",
    projectNumber: "",
    startDate: "",
    endDate: "",
    status: "",
    clientName: "",
    productionCompany: "",
  });

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setFormData({
      projectManager: "",
      projectName: "",
      projectNumber: "",
      startDate: "",
      endDate: "",
      status: "",
      clientName: "",
      productionCompany: "",
    });
    setErrors({});
  };
  const handleShowEditModal = (row) => {
    setFormData({
      id: row.id, // Ensure ID is included for updating
      firstName: row.firstName || "",
      lastName: row.lastName || "",
      email: row.email || "",
      phone: row.phone || "",
      streetAddress: row.streetAddress || "",
      streetAddress2: row.streetAddress2 || "",
      city: row.city || "",
      state: row.state || "",
      zip: row.zip || "",
      contactPersonFirst: row.contactPersonFirst || "",
      contactPersonLast: row.contactPersonLast || "",
      note: row.note || "",
    });
  
    setProjectId(row.id); // Ensure projectId is set
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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    if (!value) {
      errorMsg = "This field is required";
    } else {
      if (name === "projectNumber" && value <= 0) {
        errorMsg = "Project number must be positive";
      }
      if (
        name === "startDate" &&
        formData.endDate &&
        value > formData.endDate
      ) {
        errorMsg = "Start date cannot be after end date";
      }
      if (
        name === "endDate" &&
        formData.startDate &&
        value < formData.startDate
      ) {
        errorMsg = "End date cannot be before start date";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/createProject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Project creation failed");
        }
        await fetchProjects();
        handleCloseAddModal();
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  const handleEditSubmit = async () => {
    if (!formData.id) {
      console.error("Missing client ID");
      return;
    }
  
    try {
      setIsUpdating(true);
      console.log("Gggg",formData)
  
      const response = await fetch(`/api/editClient`, { // Ensure correct API endpoint
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("Update Successful:", result);
        await fetchProjects(); // Refresh project list
        handleCloseEditModal();
      } else {
        console.error("Update Failed:", result.error);
      }
    } catch (error) {
      console.error("Error updating client:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  

  const rowsPerPage = 5;

  useEffect(() => {
    // Simulating data fetch
    setTimeout(() => {
      setIsGlobalLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const [companyRes, managerRes, clientRes] = await Promise.all([
          fetch("/api/getProductionCompany"),
          fetch("/api/getProductManager"),
          fetch("/api/getClientName"),
        ]);

        const [companyData, managerData, clientData] = await Promise.all([
          companyRes.json(),
          managerRes.json(),
          clientRes.json(),
        ]);

        setProdCompany(companyData.data);
        setProdManager(managerData.data);
        setClient(clientData.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    }

    fetchDropdownData();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsGlobalLoading(true);
      const response = await fetch("/api/getClient");
      const result = await response.json();
      setProjects(result.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsGlobalLoading(false);
    }
  };

  console.log("kk", projects);

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredData = projects.filter(
    (item) =>
      item.firstName.toLowerCase().includes(filterText.toLowerCase()) ||
      item.lastName.toLowerCase().includes(filterText.toLowerCase()) ||
      item.email.toLowerCase().includes(filterText.toLowerCase()) ||
      (item.phone &&
        item.phone.toLowerCase().includes(filterText.toLowerCase())) ||
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
      width: "80px",
    },
    {
      name: "First Name",
      selector: (row) => row.firstName,
      sortable: true,
      width: "130px",
    },
    {
      name: "Last Name",
      selector: (row) => row.lastName,
      sortable: true,
      width: "130px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "200px",
    },
    {
      name: "Phone",
      selector: (row) => row.phone || "N/A",
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
      width: "140px",
    },
    {
      name: "Contact Person",
      selector: (row) =>
        `${row.contactPersonFirst || "N/A"} ${row.contactPersonLast || ""}`.trim(),
      sortable: true,
      width: "180px",
    },
    {
      name: "Note",
      selector: (row) => row.note || "N/A",
      width: "250px",
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
                <h3 className="mb-0 fw-bold">Clients</h3>
              </div>
            </Col>
          </Row>

          <div className="d-flex justify-content-end me-2">
            <Link href="/client/addClient">
              <Button variant="primary">Add Client</Button>
            </Link>
          </div>

          <div className="d-flex justify-content-center flex-wrap mt-5 gap-3 mb-8 ms-4 me-4">
            <ChartsComponent
              type="bar"
              options={ClientChartOptions}
              series={[{ data: clientChartData }]}
              width="100%"
              height="300"
              containerStyle={{ flex: "0 0 100%" }}
              containerClassname="p-3 bg-white rounded shadow"
              title="Client Count by Contact Person"
            />
          </div>

          <Row className="mt-5 ms-2 me-2">
            <SearchExportComponent
              filterText={filterText}
              setFilterText={setFilterText}
              data={filteredData}
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
              <Modal.Title>Edit Client</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Street Address</Form.Label>
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

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Contact Person First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="contactPersonFirst"
                        value={formData.contactPersonFirst}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Contact Person Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="contactPersonLast"
                        value={formData.contactPersonLast}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Note</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        rows={3}
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
