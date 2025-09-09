"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { InvoiceHeader } from "./InvoiceHeader";

export const InvoiceForm = () => {
  const searchParams = useSearchParams();
  const pathname = window.location.pathname;
  const [invoiceData, setInvoiceData] = useState({
    invoiceTitle: getInvoiceTitle(pathname).title,
    invoiceNoLabel: getInvoiceTitle(pathname).numberLabel,
    invoiceNo: "",
    invoiceDateLabel: getInvoiceTitle(pathname).dateLabel,
    invoiceDate: "",
    customFields: [],
    type: getInvoiceTitle(pathname).type,
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-white shadow-lg rounded-lg mt-5">
      <ToastContainer />

      <InvoiceHeader
        handleInvoiceChange={handleInvoiceChange}
        invoiceData={invoiceData}
        addCustomField={addCustomField}
        updateCustomField={updateCustomField}
        removeCustomField={removeCustomField}
      />
    </div>
  );
};
