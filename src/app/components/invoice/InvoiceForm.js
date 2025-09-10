"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { OrganizationForm } from "@/src/app/components/invoice/OrganizationForm";
import { ClientForm } from "@/src/app/components/invoice/ClientForm";
import { ToastContainer } from "react-toastify";
import { InvoiceHeader } from "./InvoiceHeader";

// Function to determine invoice type and labels based on pathname
const getInvoiceTitle = (pathname) => {
  if (pathname.includes("/invoice-generator")) {
    return {
      title: "INVOICE",
      numberLabel: "Invoice No.",
      dateLabel: "Invoice Date",
      type: "invoice",
    };
  }
  // Add more invoice types as needed
  return {
    title: "INVOICE",
    numberLabel: "Invoice No.",
    dateLabel: "Invoice Date",
    type: "invoice",
  };
};

export const InvoiceForm = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [invoiceData, setInvoiceData] = useState({
    invoiceTitle: getInvoiceTitle(pathname).title,
    invoiceNoLabel: getInvoiceTitle(pathname).numberLabel,
    invoiceNo: "",
    invoiceDateLabel: getInvoiceTitle(pathname).dateLabel,
    invoiceDate: "",
    customFields: [],
    type: getInvoiceTitle(pathname).type,
  });
  const [userInfo, setUserInfo] = useState({
    country: countryList().getLabel("IN"),
    businessName: "",
    phoneNumber: "",
    email: "",
    tax: "",
    pan: "",
    address: "",
    pinCode: "",
    city: "",
    state: "",
    signature: null,
  });

  const [clientsBillingInfo, setClientsBillingInfo] = useState({
    country: countryList().getLabel("IN"),
    businessName: "",
    phoneNumber: "",
    email: "",
    tax: "",
    pan: "",
    address: "",
    pinCode: "",
    city: "",
    state: "",
  });

  const handleInvoiceChange = (field, value) => {
    setInvoiceData({
      ...invoiceData,
      [field]: value,
    });
  };

  const addCustomField = () => {
    setInvoiceData({
      ...invoiceData,
      customFields: [...invoiceData.customFields, { label: "", value: "" }],
    });
  };
  const updateCustomField = (index, key, newValue) => {
    const updatedFields = [...invoiceData.customFields];
    updatedFields[index] = { ...updatedFields[index], [key]: newValue };

    setInvoiceData({
      ...invoiceData,
      customFields: updatedFields,
    });
  };
  const removeCustomField = (index) => {
    const updatedFields = invoiceData.customFields.filter(
      (_, i) => i !== index
    );
    setInvoiceData({
      ...invoiceData,
      customFields: updatedFields,
    });
  };

  useEffect(() => {
    const copyId = searchParams.get("copyId");
    if (copyId) {
      const fetchInvoiceForCopy = async () => {
        try {
          const response = await fetch(`/api/invoices/${copyId}`);
          if (response.ok) {
            const invoiceData = await response.json();
            console.log(invoiceData, "INVOICE DATA");
            const documentType = getInvoiceTitle(pathname);

            // Set invoice data with modifications for copy
            setInvoiceData((prevData) => ({
              ...prevData,
              invoiceTitle: invoiceData.invoice.invoiceTitle,
              invoiceNoLabel: invoiceData.invoice.invoiceNoLabel,
              invoiceNo: `${invoiceData.invoice.invoiceNo}`,
              invoiceDateLabel: invoiceData.invoice.invoiceDateLabel,
              invoiceDate: new Date().toISOString().split("T")[0], // Set to today
              customFields: invoiceData.invoice.customFields || [],
              type: documentType.type, // Set type based on current pathname
            }));

            // Set logo
            if (invoiceData.invoice.logo) {
              setLogo(invoiceData.invoice.logo);
              localStorage.setItem("invoiceLogo", invoiceData.invoice.logo);
            }

            // Set user billing info
            if (invoiceData.profiles) {
              setUsersBillingInfo({
                businessName: invoiceData.profiles.name,
                phoneNumber: invoiceData.profiles.phone,
                email: invoiceData.profiles.email,
                country:
                  invoiceData.profiles.country || countryList().getLabel("IN"),
                state: invoiceData.profiles.state,
                city: invoiceData.profiles.city,
                address: invoiceData.profiles.address,
                pinCode: invoiceData.profiles.postalCode,
                tax: invoiceData.profiles.taxInformation,
                pan: invoiceData.profiles.taxId,
                signature: invoiceData.profiles.signature,
              });
            }

            // Set client billing info
            if (invoiceData.client) {
              setClientsBillingInfo({
                businessName: invoiceData.client.name,
                phoneNumber: invoiceData.client.phone,
                email: invoiceData.client.email,
                country:
                  invoiceData.client.country || countryList().getLabel("IN"),
                state: invoiceData.client.state,
                city: invoiceData.client.city,
                address: invoiceData.client.address,
                pinCode: invoiceData.client.postalCode,
                tax: invoiceData.client.taxInformation,
                pan: invoiceData.client.taxId,
              });
            }

            // Set bank details
            if (invoiceData.bank) {
              setBankDetails({
                bankName: invoiceData.bank.bankName,
                accountName: invoiceData.bank.accountName,
                accountNumber: invoiceData.bank.accountNumber,
                ifscCode: invoiceData.bank.ifscCode,
              });
            }

            // Set tax configuration from copied invoice
            setSelectedTaxType(invoiceData.invoice.selectedTaxType || "gst");
            setGstType(invoiceData.invoice.gstType || "cgst_sgst");

            toast.success("Invoice data loaded successfully!");
          } else {
            toast.error("Failed to load invoice data");
          }
        } catch (error) {
          console.error("Error fetching invoice for copy:", error);
          toast.error("Failed to load invoice data");
        }
      };

      fetchInvoiceForCopy();
    }
  }, [searchParams]);

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

      <div className="flex flex-row items-center justify-center gap-x-8 mt-4">
        <OrganizationForm />
        <ClientForm />
      </div>
    </div>
  );
};
