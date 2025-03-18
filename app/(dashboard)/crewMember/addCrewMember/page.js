"use client";
// pages/addCrewMember.js
import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { BsArrowLeft } from "react-icons/bs";

const AddCrewMemberPage = () => {
  const router = useRouter();
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
  const [projects, setProjects] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (name === "phone" && !/^\d{10}$/.test(value)) {
        errorMsg = "Phone number must be exactly 10 digits long";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/createCrewmember", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Crew member creation failed");
        }

        // Redirect to the crew members list page after successful creation
        router.push("/crewMember");
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
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

  console.log("maaa", projectManagers);
  return (
    <Container>
         <div className="d-flex align-items-center mb-4 ms-3 mt-5">
        <button
          className="border-0 bg-transparent p-0 d-flex align-items-center"
          onClick={() => window.history.back()}
        >
          <BsArrowLeft className="me-0 fw-bold" size={24} />
        </button>
        <h3 className="ms-3 mb-0">Add Crew Member</h3>
      </div>

      <Form onSubmit={handleSubmit} className="mx-4  ">
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
                 placeholder="Enter first name"
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
                placeholder="Enter last name"
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
              <Form.Label>Role Position</Form.Label>
              <Form.Select
                name="rolePosition"
                value={formData.rolePosition}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.rolePosition}
              >
                <option value="">Select Role Position</option>
                <option value="Camera Operator">Camera Operator</option>
                <option value="Director">Director</option>
                <option value="Producer">Producer</option>
                <option value="Sound Engineer">Sound Engineer</option>
                <option value="Lighting Technician">Lighting Technician</option>
                <option value="Editor">Editor</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.rolePosition}
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
                placeholder="Enter xyz@email "
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
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.phone}
                placeholder="1234567890"
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
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
                 placeholder="Enter address"
              />
              <Form.Control.Feedback type="invalid">
                {errors.streetAddress}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
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
                 placeholder="Enter address"
              />
              <Form.Control.Feedback type="invalid">
                {errors.streetAddress2}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
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
                placeholder="Enter city name"
              />
              <Form.Control.Feedback type="invalid">
                {errors.city}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
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
                placeholder="Enter State name"
              />
              <Form.Control.Feedback type="invalid">
                {errors.state}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>ZIP Code</Form.Label>
              <Form.Control
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.zip}
                 placeholder="Enter ZIP code"
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
          <Col md={6}>
            <Form.Group>
              <Form.Label>Projects</Form.Label>
              <Form.Select
                name="projectId"
                value={formData.projectId} // Single value, not an array
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectId: e.target.value, // Store only one selected value
                  })
                }
                isInvalid={!!errors.projectId}
              >
                <option value="">Select a Project</option>{" "}
                {/* Default option */}
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.projectName}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.projectId}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </Form>
    </Container>
  );
};

export default AddCrewMemberPage;
