"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import countryList from "react-select-country-list";
import { OrganizationForm } from "@/src/app/components/invoice/OrganizationForm";
import { ClientForm } from "@/src/app/components/invoice/ClientForm";
import { ToastContainer, toast } from "react-toastify";
import { InvoiceHeader } from "./InvoiceHeader";
import { Title } from "./Title";
import { TaxModal } from "./TaxModal";
import { CurrencySelector } from "./CurrencySelector";
import { BankDetailsForm } from "./BankDetailsForm";
import { Items } from "./Items";

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

  const [clientInfo, setClientInfo] = useState({
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
  const [currency, setCurrency] = useState("INR");
  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  // Items state
  const [items, setItems] = useState([
    {
      id: 1,
      name: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      taxRate: 0,
      gstRate: 0,
    },
  ]);

  // Tax configuration state
  const [selectedTaxType, setSelectedTaxType] = useState("none");
  const [gstType, setGstType] = useState("cgst_sgst");

  // Discount state
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("percentage");
  const [discountHidden, setDiscountHidden] = useState(false);

  // Bank details state
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifscCode: "",
  });

  // Logo state
  const [logo, setLogo] = useState(null);

  // User billing info state
  const [usersBillingInfo, setUsersBillingInfo] = useState({
    businessName: "",
    phoneNumber: "",
    email: "",
    country: countryList().getLabel("IN"),
    state: "",
    city: "",
    address: "",
    pinCode: "",
    tax: "",
    pan: "",
    signature: null,
  });

  // Client billing info state
  const [clientsBillingInfo, setClientsBillingInfo] = useState({
    businessName: "",
    phoneNumber: "",
    email: "",
    country: countryList().getLabel("IN"),
    state: "",
    city: "",
    address: "",
    pinCode: "",
    tax: "",
    pan: "",
  });

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

  // Items handlers
  const handleItemChange = (itemId, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          // Calculate amount when quantity or rate changes
          if (field === "quantity" || field === "rate") {
            updatedItem.amount =
              parseFloat(updatedItem.quantity) * parseFloat(updatedItem.rate);
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const addItem = () => {
    const newId = Math.max(...items.map((item) => item.id), 0) + 1;
    setItems((prevItems) => [
      ...prevItems,
      {
        id: newId,
        name: "",
        quantity: 1,
        rate: 0,
        amount: 0,
        taxRate: 0,
        gstRate: 0,
      },
    ]);
  };

  const removeItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Tax handlers
  const handleItemTaxChange = (itemId, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleTaxConfigChange = (taxType, gstType) => {
    setSelectedTaxType(taxType);
    setGstType(gstType);
  };

  // Discount handlers
  const handleDiscountChange = (value) => {
    setDiscount(parseFloat(value) || 0);
  };

  const handleDiscountTypeChange = (type) => {
    setDiscountType(type);
  };

  const handleDiscountBtn = () => {
    setDiscountHidden(!discountHidden);
  };

  // Calculate totals
  const totals = {
    subtotal: items.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    ),
    discountAmount:
      discountType === "percentage"
        ? (items.reduce(
            (sum, item) => sum + (parseFloat(item.amount) || 0),
            0
          ) *
            discount) /
          100
        : discount,
    total:
      items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0) -
      (discountType === "percentage"
        ? (items.reduce(
            (sum, item) => sum + (parseFloat(item.amount) || 0),
            0
          ) *
            discount) /
          100
        : discount),
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleOpenModal = () => {
    setModalIsOpen(true);
  };
  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-white shadow-lg rounded-lg mt-5">
      <ToastContainer />
      <Title
        invoiceData={invoiceData}
        handleInvoiceChange={handleInvoiceChange}
      />
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
      <BankDetailsForm />
      <div className="flex flex-row gap-4 mt-6 ">
        <div>
          <TaxModal
            modalIsOpen={modalIsOpen}
            handleCloseModal={handleCloseModal}
          />
          <button
            onClick={handleOpenModal}
            className="px-3 sm:px-8 py-2.5 rounded-xl text-[#0a3a5f] hover:text-[#0e5389] border-2 border-[#379cea]/20 hover:border-[#379cea]/40 hover:bg-[#379cea]/10 transition-all duration-200 shadow-sm font-medium w-full sm:w-auto"
          >
            Tax Details
          </button>
        </div>
        <div className="w-full sm:w-auto">
          <CurrencySelector handleCurrencyChange={handleCurrencyChange} />
        </div>
      </div>
      <Items
        items={items}
        handleChange={handleItemChange}
        removeItem={removeItem}
        addItem={addItem}
        discount={discount}
        discountType={discountType}
        discountHidden={discountHidden}
        handleDiscountChange={handleDiscountChange}
        handleDiscountTypeChange={handleDiscountTypeChange}
        handleDiscountBtn={handleDiscountBtn}
        totals={totals}
        currency={currency}
        handleCurrencyChange={handleCurrencyChange}
        selectedTaxType={selectedTaxType}
        gstType={gstType}
        handleItemTaxChange={handleItemTaxChange}
        handleTaxConfigChange={handleTaxConfigChange}
      />
    </div>
  );
};
