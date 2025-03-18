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
  const [showEditModal, setShowEditModal] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [crewMembers, setCrewMembers] = useState([]);
  const [crewMemberId, setCrewMemberId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [projectManagers, setProjectManagers] = useState([]);
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    rolePosition: "",
    email: "",
    phone: "",
    streetAddress: "",
    streetAddress2: "",
    city: "",
    state: "",
    zip: "",
    projectManagerId: "",
    projectIds: [],
  });


  const handleShowEditModal = (row) => {
    setFormData({
      id: row.id,
      firstName: row.firstName || "",
      lastName: row.lastName || "",
      rolePosition: row.rolePosition || "",
      email: row.email || "",
      phone: row.phone || "",
      streetAddress: row.address?.streetAddress || "",
      streetAddress2: row.address?.streetAddress2 || "",
      city: row.address?.city || "",
      state: row.address?.state || "",
      zip: row.address?.zip || "",
      projectManagerId: row.projectManager?.id || "", // Corrected
      projectIds: row.projects?.map((p) => p.id) || [], // Corrected
    });
  
    setCrewMemberId(row.id);
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
      if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
        errorMsg = "Invalid email address";
      }
      if (name === "phone" && !/^\d{3}-\d{3}-\d{4}$/.test(value)) {
        errorMsg = "Phone number must be in the format XXX-XXX-XXXX";
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



  const handleEditSubmit = async () => {
    if (!formData.id) {
      console.error("Missing crew member ID");
      return;
    }

    try {
      setIsUpdating(true);
      const response = await fetch(`/api/editCrewMember`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Update Successful:", result);
        await fetchCrewMembers();
        handleCloseEditModal();
      } else {
        console.error("Update Failed:", result.error);
      }
    } catch (error) {
      console.error("Error updating crew member:", error);
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
        const [managerRes, projectRes] = await Promise.all([
          fetch("/api/getProductManager"),
          fetch("/api/getProjects"),
        ]);

        const [managerData, projectData] = await Promise.all([
          managerRes.json(),
          projectRes.json(),
        ]);

        setProjectManagers(managerData.data);
        setProjects(projectData.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    }

    fetchDropdownData();
  }, []);



  const fetchCrewMembers = async () => {
    try {
      setIsGlobalLoading(true);
      const response = await fetch("/api/getCrewMembers");
      const result = await response.json();
      setCrewMembers(result.data || []);
    } catch (error) {
      console.error("Error fetching crew members:", error);
    } finally {
      setIsGlobalLoading(false);
    }
  };

  useEffect(() => {
    fetchCrewMembers();
  }, []);

  console.log("peo",projects)

  const filteredData = crewMembers.filter(
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
      width: "150px",
    },
    {
      name: "Last Name",
      selector: (row) => row.lastName,
      sortable: true,
      width: "150px",
    },
    {
      name: "Role Position",
      selector: (row) => row.rolePosition,
      sortable: true,
      width: "200px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "250px",
    },
    {
      name: "Phone",
      selector: (row) => row.phone || "N/A",
      sortable: true,
      width: "150px",
    },
    {
      name: "City",
      selector: (row) => row.address?.city || "N/A",
      sortable: true,
      width: "150px",
    },
    {
      name: "State",
      selector: (row) => row.address?.state || "N/A",
      sortable: true,
      width: "100px",
    },
    {
      name: "Project Manager",
      selector: (row) => row.projectManager?.fullName || "N/A",
      sortable: true,
      width: "200px",
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
      width: "120px",
    },
  ];
  
  


  console.log("fkkfkk",paginatedData)

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
                <h3 className="mb-0 fw-bold">Crew Members</h3>
              </div>
            </Col>
          </Row>

          <div className="d-flex justify-content-end me-2">
            <Link href="/crewMember/addCrewMember">
              <Button variant="primary">Add Crew</Button>
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
              title="Crew Member Count by Role"
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
              <Modal.Title>Edit Crew Member</Modal.Title>
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
                        onBlur={handleBlur}
                        isInvalid={!!errors.firstName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName}
                      </Form.Control.Feedback>
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
                        onBlur={handleBlur}
                        isInvalid={!!errors.lastName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                <Col md={6}>
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.phone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>


                <Row className="mb-3">
               
                  <Col md={6}>
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
                  <Col md={6}>
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
                </Row>



                <Row className="mb-3">
            
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Role Position</Form.Label>
                      <Form.Control
                        type="text"
                        name="rolePosition"
                        value={formData.rolePosition}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.rolePosition}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.rolePosition}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                <Col md={6}>
                    <Form.Group>
                      <Form.Label>Project Manager</Form.Label>
                      <Form.Select
                        name="projectManagerId"
                        value={formData.projectManagerId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.projectManagerId}
                      >
                        <option value="">Select Project Manager</option>
                        {projectManagers.map((manager) => (
                          <option key={manager.id} value={manager.id}>
                            {manager.fullName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.projectManagerId}
                      </Form.Control.Feedback>
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
