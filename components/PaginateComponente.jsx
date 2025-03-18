import React from "react";
import { Pagination } from "react-bootstrap";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Pagination className="mt-3 ms-3">
      <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        <ChevronsLeft size="18px" />
      </Pagination.First>
      <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft size="18px" />
      </Pagination.Prev>

      {currentPage > 1 && (
        <Pagination.Item onClick={() => onPageChange(currentPage - 1)}>
          {currentPage - 1}
        </Pagination.Item>
      )}

      <Pagination.Item active>{currentPage}</Pagination.Item>

      {currentPage < totalPages && (
        <Pagination.Item onClick={() => onPageChange(currentPage + 1)}>
          {currentPage + 1}
        </Pagination.Item>
      )}

      <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <ChevronRight size="18px" />
      </Pagination.Next>
      <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
        <ChevronsRight size="18px" />
      </Pagination.Last>
    </Pagination>
  );
};

export default PaginationComponent;
