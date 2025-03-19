import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FaSearch, FaDownload, FaPlus } from "react-icons/fa";
import { TbSearchOff } from "react-icons/tb";
import { exportCSV } from "../utils";
import Link from "next/link";

const SearchExportComponent = ({
  filterText,
  setFilterText,
  data,
  buttonText,
  link,
}) => {
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
            <Form.Control
              type="text"
              placeholder="Search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              autoFocus
            />
          </InputGroup>
        </div>
      )}
      <div className="d-flex ">
        <Link href={link} className="me-2">
          <Button variant="primary">
            <FaPlus className="me-1" />
            {buttonText}
          </Button>
        </Link>
        <Button variant="primary" onClick={() => exportCSV(data)}>
          <FaDownload className="me-2" /> Export CSV
        </Button>
      </div>
    </div>
  );
};

export default SearchExportComponent;
