import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FaSearch, FaDownload } from "react-icons/fa";
import { TbSearchOff } from "react-icons/tb";
import { exportCSV } from "../utils";

const SearchExportComponent = ({ filterText, setFilterText, data }) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      {!showSearch ? (
        <Button variant="primary" onClick={() => setShowSearch(true)}>
          <FaSearch />
        </Button>
      ) : (
        <div className="d-flex">
          <Button variant="primary" onClick={() => setShowSearch(false)}>
            <TbSearchOff size={20} />
          </Button>
          <InputGroup className="ms-2">
            <Form.Control type="text" placeholder="Search" value={filterText} onChange={(e) => setFilterText(e.target.value)} autoFocus />
          </InputGroup>
        </div>
      )}
      <Button variant="primary" onClick={() => exportCSV(data)}>
        <FaDownload className="me-2" /> Export CSV
      </Button>
    </div>
  );
};

export default SearchExportComponent;
