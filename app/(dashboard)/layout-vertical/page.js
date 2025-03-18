"use client";
import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap";
import DataTableComponent from "../../../components/DataTableComponent";
import PaginationComponent from "../../../components/PaginateComponente";
import ChartsComponent from "../../../components/ChartsComponent";
import SearchExportComponent from "../../../components/SearchExportComponent";
import { data } from "../../../utils";

const TableComponent = () => {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const rowsPerPage = 5;

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.category.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Container className="mt-4">
      {/* Search & Export Buttons */}
      <SearchExportComponent
        filterText={filterText}
        setFilterText={setFilterText}
        data={filteredData}
      />

      {/* Data Table */}
      <DataTableComponent paginatedData={paginatedData} />

      {/* Pagination */}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <div className="d-flex justify-content-end me-2">
            <Button variant="primary" onClick={handleShow}>
              Add User
            </Button>
      
            <Modal show={show} onHide={handleClose} centered size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Add New User</Modal.Title>
              </Modal.Header>
      
              <Modal.Body>
                <Form>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="First Name" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Last Name" />
                      </Form.Group>
                    </Col>
                  </Row>
      
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Email" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="tel" placeholder="Phone Number" />
                      </Form.Group>
                    </Col>
                  </Row>
      
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Department</Form.Label>
                        <Form.Control type="text" placeholder="Department" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Company</Form.Label>
                        <Form.Control type="text" placeholder="Company" />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
      
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                  Add User
                </Button>
              </Modal.Footer>
            </Modal>
          </div>

      {/* Charts */}
      <ChartsComponent />
    </Container>
  );
};

export default TableComponent;
