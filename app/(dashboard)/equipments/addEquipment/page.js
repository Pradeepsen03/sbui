"use client";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsArrowLeft } from "react-icons/bs";

const AddEquipmentPage = () => {
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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crewMembers, setCrewMembers] = useState([]);
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
    console.log("Submitting equipment:", formData);

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/createEquiment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Equipment creation failed");
        }
        router.push("/equipments"); // Redirect to the equipment list page
      } catch (err) {
        console.error(err.message);
        setErrors((prev) => ({ ...prev, submitError: err.message }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const crewMembersRes = await fetch("/api/getCrewMembers");
        const crewMembersData = await crewMembersRes.json();
        setCrewMembers(crewMembersData.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    }

    fetchDropdownData();
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
        <h3 className="ms-3 mb-0">Add New Equipment</h3>
      </div>

      <Form onSubmit={handleSubmit} className="ms-3 me-3">
        {/* Equipment Information */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
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
                onBlur={handleBlur}
                isInvalid={!!errors.type}
              />
              <Form.Control.Feedback type="invalid">
                {errors.type}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
     
          <Col md={6}>
            <Form.Group>
              <Form.Label>Crew Member</Form.Label>
              <Form.Control
                as="select"
                name="crewMemberId"
                value={formData.crewMemberId}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.crewMemberId}
              >
                <option value="">Select Crew Member</option>
                {crewMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.fullName}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.crewMemberId}
              </Form.Control.Feedback>
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
                onBlur={handleBlur}
                isInvalid={!!errors.location}
              />
              <Form.Control.Feedback type="invalid">
                {errors.location}
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

export default AddEquipmentPage;