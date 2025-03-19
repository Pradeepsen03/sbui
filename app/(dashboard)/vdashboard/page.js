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

const Projects = () => {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
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




  useEffect(() => {
    // Simulating data fetch
    setTimeout(() => {
      setIsGlobalLoading(false); // Set loading to false once data is ready
    }, 2000);
  }, []);

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
                    {/* Page header */}
                    <div className="border-bottom pb-4 mb-4 mt-4 ms-4 ">
                      <h3 className="mb-0 fw-bold">Dashboard</h3>
                    </div>
                  </Col>
                </Row>
          
                <div className="d-flex justify-content-center flex-wrap mt-5 ms-1 gap-3">
                  <ChartsComponent
                    type="pie"
                    options={stockChartOptions}
                    series={stockCount}
                    width="100%"
                    height="100%"
                    containerStyle={{ flex: "0 0 37%" }}
                    containerClassname="p-3 bg-white rounded shadow"
                    title="Project by Status"
                  />
          
                  <ChartsComponent
                    type="line"
                    options={budgetChartOptions}
                    series={budgetChartData}
                    width="100%"
                    height="280"
                    containerStyle={{ flex: "0 0 60%" }}
                    containerClassname="p-3 bg-white rounded shadow"
                    title="Budget Distribution"
                  />
          
                  <ChartsComponent
                    type="bar"
                    options={ClientChartOptions}
                    series={[{ data: clientChartData }]}
                    width="100%"
                    height="250"
                    containerStyle={{ flex: "0 0 37%" }}
                    containerClassname="p-3 bg-white rounded shadow"
                    title="Client Count by Contact Person"
                  />
          
                  <ChartsComponent
                    type="bar"
                    options={EquipmentChartOptions}
                    series={[{ data: equipmentChartData }]}
                    width="100%"
                    height="100%"
                    containerStyle={{ flex: "0 0 60%" }}
                    containerClassname="p-3 bg-white rounded shadow"
                    title="Equipment Type Count"
                  />
          
                  <ChartsComponent
                    type="bar"
                    options={CallProjectChartOptions}
                    series={[{ data: callProjectChartData }]}
                    width="100%"
                    height="250"
                    containerStyle={{ flex: "0 0 98%" }}
                    containerClassname="p-3 bg-white rounded shadow ms-4 me-4"
                    title="Call per Project "
                  />
                </div>
              </div>
          
      )}
    </>
  )
};

export default Projects;
