"use client";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsArrowLeft } from "react-icons/bs";

const AddCallSheetPage = () => {
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
    parkingNotes: "" || "all good",
  });
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateField = (name, value) => {
    let errorMsg = "";
    if (!value) {
      errorMsg = "This field is required";
    } else if (name === "zip" && !/^\d{5}$/.test(value)) {
      errorMsg = "Zip code must be 5 digits";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting Call Sheet:", formData);

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/createCallsheet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Call Sheet creation failed");
        }
        router.push("/callsheet"); // Redirect to Call Sheets list
      } catch (err) {
        console.error(err.message);
        setErrors((prev) => ({ ...prev, submitError: err.message }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/getProjects");
        const result = await response.json();
        setProjects(result.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Container className="mt-4 mb-2">
         <div className="d-flex align-items-center mb-4 ms-3">
        <button
          className="border-0 bg-transparent p-0 d-flex align-items-center"
          onClick={() => window.history.back()}
        >
          <BsArrowLeft className="me-0 fw-bold" size={24} />
        </button>
        <h3 className="ms-3 mb-0">Add New Call Sheet</h3>
      </div>
      <Form onSubmit={handleSubmit} className="ms-3 me-3">
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Project</Form.Label>
              <Form.Control
                as="select"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                onBlur={handleBlur} // Ensure validation runs on blur
                isInvalid={!!errors.projectId}
                disabled={projects.length === 0} // Disable if projects are still loading
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
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
              <Form.Label>Zip</Form.Label>
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
          <Col md={4}>
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
          <Col md={4}>
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
          <Col md={4}>
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

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="px-4 py-2"
        >
          {isSubmitting ? "Submitting..." : "Create Call Sheet"}
        </Button>

        {errors.submitError && (
          <div className="text-danger mt-2">{errors.submitError}</div>
        )}
      </Form>
    </Container>
  );
};

export default AddCallSheetPage;
