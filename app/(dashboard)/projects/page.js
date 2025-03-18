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
      projectId: row.id, // Set the projectId
      projectManager: row.projectManagers?.[0]?.id || "",
      projectName: row.projectName || "",
      projectNumber: row.projectNumber || "",
      startDate: row.startDate
        ? new Date(row.startDate).toISOString().split("T")[0]
        : "",
      endDate: row.endDate
        ? new Date(row.endDate).toISOString().split("T")[0]
        : "",
      status: row.status || "",
      clientName: row.clients?.[0]?.id,
      productionCompany: row.productionCompanies?.[0]?.id,
    });
    setProjectId(row.id); // Set the project ID
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
    try {
      setIsUpdating(true);
    console.log("nj",formData)

      const response = await fetch("/api/editProject", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Update Successful:", result);
        await fetchProjects();
        handleCloseEditModal();
      } else {
        console.error("Update Failed:", result.error);
      }
    } catch (error) {
      console.error("Error updating project:", error);
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
      const response = await fetch("/api/getProjects");
      const result = await response.json();
      setProjects(result.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsGlobalLoading(false);
    }
  };

console.log('kk',projects)

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredData = projects.filter(
    (item) =>
      item.projectName.toLowerCase().includes(filterText.toLowerCase()) ||
      item.projectNumber
        .toString()
        .toLowerCase()
        .includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const columns = [
    {
      name: "Project Number",
      selector: (row) => row.projectNumber,
      sortable: true,
    },
    {
      name: "Project Name",
      selector: (row) => row.projectName,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => new Date(row.startDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => new Date(row.endDate).toLocaleDateString(),
      sortable: true,
    },
    { name: "Status", cell: (row) => statusBadge(row.status), sortable: true },
    {
      name: "Production Companies",
      selector: (row) =>
        row.productionCompanies.map((pc) => pc.name).join(", ") || "N/A",
      sortable: true,
    },
    {
      name: "Clients",
      selector: (row) =>
        row.clients.map((client) => client.fullName).join(", ") || "N/A",
      sortable: true,
    },
    {
      name: "Project Managers",
      selector: (row) =>
        row.projectManagers.map((pm) => pm.fullName).join(", ") || "N/A",
      sortable: true,
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
                <h3 className="mb-0 fw-bold">Projects</h3>
              </div>
            </Col>
          </Row>

          <div className="d-flex justify-content-end me-2">
            <Link href="/projects/addUser">
            <Button variant="primary" onClick={()=>router.push('/projects/addUser')}>
              Add User
            </Button>
            </Link>

     
          </div>

          <div className="d-flex justify-content-center flex-wrap mt-5 gap-3 mb-5">
            <ChartsComponent
              type="pie"
              options={stockChartOptions}
              series={stockCount}
              width="100%"
              height="100%"
              containerStyle={{ flex: "0 0 30%" }}
              containerClassname="p-3 bg-white rounded shadow mt-2 mb-4"
              title="Project by Status"
            />

            <ChartsComponent
              type="line"
              options={budgetChartOptions}
              series={budgetChartData}
              width="100%"
              height="300"
              containerStyle={{ flex: "0 0 66%" }}
              containerClassname="p-3 bg-white rounded shadow mt-2 mb-4"
              title="Budget Distribution by Client"
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
              handleShowEditModal={handleShowEditModal} // Ensure the prop name matches
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
              <Modal.Title>Edit Project</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Project Manager</Form.Label>
                      <Form.Select
                        name="projectManager"
                        value={formData.projectManager}
                        onChange={handleChange}
                      >
                        {prodManager.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.fullName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Project Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Project Number</Form.Label>
                      <Form.Control
                        type="number"
                        name="projectNumber"
                        placeholder="Project Number"
                        value={formData.projectNumber}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="custom-date-input"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Client Name</Form.Label>
                      <Form.Select
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                      >
                        {client.length > 0 ? (
                          client.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.fullName}
                            </option>
                          ))
                        ) : (
                          <option disabled>No Data Found</option>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Production Company</Form.Label>
                      <Form.Select
                        name="productionCompany"
                        value={formData.productionCompany}
                        onChange={handleChange}
                      >
                        {prodCompany.length > 0 ? (
                          prodCompany.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No Data Found</option>
                        )}
                      </Form.Select>
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
