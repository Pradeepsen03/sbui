import React from "react";
import DataTable from "react-data-table-component";
import { MdOutlineEdit } from "react-icons/md"; // Import the edit icon
import { statusBadge } from "../utils";
import "/styles/dataTable.css";

const DataTableComponent = ({
  paginatedData,
  isLoading,
  handleShowEditModal,
  columns,
}) => {
  return (
    <DataTable
      columns={columns}
      data={paginatedData}
      progressPending={isLoading}
      highlightOnHover
      responsive
    />
  );
};

export default DataTableComponent;
