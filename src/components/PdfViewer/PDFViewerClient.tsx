"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// ตั้งค่า worker สำหรับ pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const PDFViewerClient = () => {
  // เพิ่ม type ให้ state
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  // เพิ่ม type ให้กับ parameter ใน onLoadSuccess
  const onDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => (prev - 1 <= 1 ? 1 : prev - 1));
  };

  const goToNextPage = () => {
    if (numPages !== null && pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <nav
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: pageNumber <= 1 ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: pageNumber <= 1 ? "not-allowed" : "pointer",
          }}
        >
          Prev
        </button>
        <button
          onClick={goToNextPage}
          disabled={numPages === null || pageNumber >= numPages}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor:
              numPages === null || pageNumber >= numPages ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor:
              numPages === null || pageNumber >= numPages
                ? "not-allowed"
                : "pointer",
          }}
        >
          Next
        </button>
        <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
          Page {pageNumber} of {numPages ?? "..."}
        </p>
      </nav>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Document
          file="/sample1.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Loading PDF...
            </div>
          }
          error={
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "red",
              }}
            >
              Failed to load PDF. Please make sure the file exists in the public
              folder.
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            width={800}
          />
        </Document>
      </div>
    </div>
  );
};

export default PDFViewerClient;
