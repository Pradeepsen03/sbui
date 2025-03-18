"use client";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap";
import DataTableComponent from "../../../components/DataTableComponent";
import PaginationComponent from "../../../components/PaginateComponente";
import ChartsComponent from "../../../components/ChartsComponent";
import SearchExportComponent from "../../../components/SearchExportComponent";
import { ClientChartOptions, clientChartData } from "../../../utils";
import "../../../styles/dataTable.css";
import { MdOutlineEdit } from "react-icons/md";
import Link from "next/link";

const TableComponent = () => {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [projects, setProjects] = useState([]);
  const [projects1, setProjects1] = useState([]);
  const [projectId, setProjectId] = useState(null); // Add this line
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    projectId: "",
    callSheetDate: "",
    shootLocation: "",
    streetAddress: "",
    streetAddress2: "",
    city: "",
    state: "",
    zip: "",
    startTime: "",
    endTime: "",
    parkingNotes: "",
  });

  const handleShowEditModal = (row) => {
    setFormData({
      id: row.id,
      projectId: row.projectId || "",
      callSheetDate: row.callSheetDate || "",
      shootLocation: row.shootLocation || "",
      streetAddress: row.streetAddress || "",
      streetAddress2: row.streetAddress2 || "",
      city: row.city || "",
      state: row.state || "",
      zip: row.zip || "",
      startTime: row.startTime || "",
      endTime: row.endTime || "",
      parkingNotes: row.parkingNotes || "",
    });

    setProjectId(row.id); // Set projectId for reference
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
      const value = formData[key];
      if (!value) {
        newErrors[key] = "This field is required";
      } else if (key === "zip" && !/^\d{5}$/.test(value)) {
        newErrors[key] = "Zip code must be 5 digits";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleEditSubmit = async () => {
    if (!formData.id) {
      console.error("Missing client ID");
      return;
    }

    try {
      setIsUpdating(true);
      console.log("Gggg", formData);

      const response = await fetch(`/api/editCallsheet`, {
        // Ensure correct API endpoint
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Update Successful:", result);
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

  const fetchCallSheets = async () => {
    try {
      setIsGlobalLoading(true);
      const response = await fetch("/api/getCallsheet");
      const result = await response.json();
      setProjects(result.data || []);
    } catch (error) {
      console.error("Error fetching call sheets:", error);
    } finally {
      setIsGlobalLoading(false);
    }
  };

  console.log("kk", projects);

  useEffect(() => {
    fetchCallSheets();
  }, []);

  const filteredData = projects.filter(
    (item) =>
      item.shootLocation?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.streetAddress?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.city?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.state?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.zip?.toLowerCase().includes(filterText.toLowerCase())
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
    },
    {
      name: "Call Sheet Date",
      selector: (row) => new Date(row.callSheetDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Shoot Location",
      selector: (row) => row.shootLocation,
      sortable: true,
    },
    {
      name: "Street Address",
      selector: (row) => row.streetAddress || "N/A",
      sortable: true,
    },
    {
      name: "Street Address 2",
      selector: (row) => row.streetAddress2 || "N/A",
      sortable: true,
    },
    {
      name: "City",
      selector: (row) => row.city || "N/A",
      sortable: true,
    },
    {
      name: "State",
      selector: (row) => row.state || "N/A",
      sortable: true,
    },
    {
      name: "ZIP Code",
      selector: (row) => row.zip || "N/A",
      sortable: true,
    },
    {
      name: "Start Time",
      selector: (row) => new Date(row.startTime).toLocaleTimeString(),
      sortable: true,
    },
    {
      name: "End Time",
      selector: (row) => new Date(row.endTime).toLocaleTimeString(),
      sortable: true,
    },
    {
      name: "Parking Notes",
      selector: (row) => row.parkingNotes || "N/A",
    },
    {
      name: "Project Name",
      selector: (row) => row.project.projectName,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Updated At",
      selector: (row) => new Date(row.updatedAt).toLocaleDateString(),
      sortable: true,
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
    },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/getProjects");
        const result = await response.json();
        setProjects1(result.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  console.log("ddaddadadadad", projects);

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
                <h3 className="mb-0 fw-bold">Call Sheet</h3>
              </div>
            </Col>
          </Row>

          <div className="d-flex justify-content-end me-2">
            <Link href="/callsheet/addCallsheet">
              <Button variant="primary">Add CallSheet</Button>
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
          <Modal show={showEditModal} onHide={handleCloseEditModal}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Call Sheet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Project</Form.Label>
                      <Form.Control
                        as="select"
                        name="projectId"
                        value={formData.projectId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.projectId}
                        disabled={projects1.length === 0}
                      >
                        <option value="">Select a project</option>
                        {projects1.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.projectName}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.projectId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Shoot Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="shootLocation"
                        value={formData.shootLocation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.shootLocation}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.shootLocation}
                      </Form.Control.Feedback>
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
                        onBlur={handleBlur}
                        isInvalid={!!errors.streetAddress}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.streetAddress}
                      </Form.Control.Feedback>
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
                        onBlur={handleBlur}
                        isInvalid={!!errors.streetAddress2}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.streetAddress2}
                      </Form.Control.Feedback>
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
                        onBlur={handleBlur}
                        isInvalid={!!errors.city}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.city}
                      </Form.Control.Feedback>
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
                        onBlur={handleBlur}
                        isInvalid={!!errors.state}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.state}
                      </Form.Control.Feedback>
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
                        onBlur={handleBlur}
                        isInvalid={!!errors.zip}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.zip}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Call Sheet Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="callSheetDate"
                        value={formData.callSheetDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.callSheetDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.callSheetDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Parking Notes</Form.Label>
                      <Form.Control
                        type="text"
                        name="parkingNotes"
                        value={formData.parkingNotes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.parkingNotes}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.parkingNotes}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Start Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.startTime}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.startTime}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>End Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.endTime}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.endTime}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEditModal}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={handleEditSubmit}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default TableComponent;
