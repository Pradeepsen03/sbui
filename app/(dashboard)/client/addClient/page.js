"use client";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AddClientPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    contactFirstName: "",
    contactLastName: "",
    note: "",
  });

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
    // Clear the error for the field when the user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    if (!value) {
      errorMsg = "This field is required";
    } else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errorMsg = "Invalid email address";
    } else if (name === "phone" && !/^\d{10}$/.test(value)) {
      errorMsg = "Phone number must be 10 digits";
    } else if (name === "zip" && !/^\d{5}$/.test(value)) {
      errorMsg = "Zip code must be 5 digits";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error);
    setErrors(newErrors);
    return !hasErrors; // Return true if no errors
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting client:", formData);

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/createClient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Client creation failed");
        }
        router.push("/client"); // Redirect to the client list page
      } catch (err) {
        console.error(err.message);
        setErrors((prev) => ({ ...prev, submitError: err.message }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Container className="mt-4 mb-2">
      <h3 className="text-left ms-2 mb-4">Add New Client</h3>
      <Form onSubmit={handleSubmit} className="ms-3 me-3">
        {/* Client Information */}
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
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Street Address</Form.Label>
              <Form.Control
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.address1}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address1}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Street Address 2</Form.Label>
              <Form.Control
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.address2}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address2}
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

        {/* Contact Person */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Contact Person First </Form.Label>
              <Form.Control
                type="text"
                name="contactFirstName"
                value={formData.contactFirstName}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.contactFirstName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.contactFirstName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Contact Person Last </Form.Label>
              <Form.Control
                type="text"
                name="contactLastName"
                value={formData.contactLastName}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.contactLastName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.contactLastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Notepad-like Note Input */}
        <Form.Group className="mb-3">
          <Form.Label>Note</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="note"
            value={formData.note}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={!!errors.note}
          />
          <Form.Control.Feedback type="invalid">
            {errors.note}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Submit Button */}
        <div className="text-right mt-4 text-lg">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="px-8 py-2 text-xl"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>

        {/* Display API errors */}
        {errors.submitError && (
          <div className="text-danger mt-2">{errors.submitError}</div>
        )}
      </Form>
    </Container>
  );
};

export default AddClientPage;