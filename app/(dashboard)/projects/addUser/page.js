"use client";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AddUserPage = () => {
  const [formData, setFormData] = useState({
    projectManager: "",
    projectName: "",
    projectNumber: "",
    startDate: "",
    endDate: "",
    status: "",
    clientName: "",
    productionCompany: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [prodManager, setProdManager] = useState([]);
  const [client, setClient] = useState([]);
  const [prodCompany, setProdCompany] = useState([]);
  const router = useRouter();

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

        setProdCompany(companyData.data || []);
        setProdManager(managerData.data || []);
        setClient(clientData.data || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    }
    fetchDropdownData();
  }, []);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : "This field is required",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("fgfg", formData);
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
        router.push("/projects");
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="text-left ms-2 mb-4">Add New Project</h3>
      <Form onSubmit={handleSubmit} className="ms-3 me-3">
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Project Manager</Form.Label>
              <Form.Select
                name="projectManager"
                value={formData.projectManager}
                onChange={handleChange}
              >
                <option value="">Select Project Manager</option>
                {prodManager.length > 0 ? (
                  prodManager.map((item) => (
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
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                name="projectName"
                placeholder="Project name"
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
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.projectNumber && (
                <small className="text-danger">{errors.projectNumber}</small>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.startDate && (
                <small className="text-danger">{errors.startDate}</small>
              )}
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
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.endDate && (
                <small className="text-danger">{errors.endDate}</small>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onBlur={handleBlur}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="completed">Completed</option>
                <option value="PENDING">Pending</option>
              </Form.Select>
              {errors.status && (
                <small className="text-danger">{errors.status}</small>
              )}
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
                <option value="">Select Client</option>
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
                <option value="">Select Production Company</option>
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

        <div className="text-right mt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="px-5"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AddUserPage;
