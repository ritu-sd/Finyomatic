"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  PlusCircle,
  X,
  Trash2,
  FileText,
  Calendar,
  Hash,
  Pencil,
} from "lucide-react";
import { Title } from "./Title";

export const InvoiceHeader = ({
  handleInvoiceChange,
  invoiceData,
  addCustomField,
  updateCustomField,
  removeCustomField,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Title />
      <div className="w-full">
        {/* Invoice Header Section */}
        <div className="mb-12">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[var(--text-primary)] rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Invoice Header
              </h2>
            </div>
          </div>

          {/* Invoice Title */}
          {/* <div className="text-center mb-8">
          <div className="relative inline-block">
            <input
              type="text"
              value={invoiceData?.invoiceTitle}
              onChange={(e) =>
                handleInvoiceChange("invoiceTitle", e.target.value)
              }
              className="text-3xl font-bold text-[var(--text-primary)] bg-transparent border-2 border-dashed border-gray-300 rounded-lg px-6 py-3 text-center w-full max-w-md mx-auto focus:outline-none focus:border-[var(--text-primary)] focus:border-solid hover:border-gray-400 transition-all duration-200 cursor-text"
              placeholder="INVOICE"
            />
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-[var(--text-primary)] rounded-full flex items-center justify-center">
              <Pencil className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Invoice Details */}
            <div className="space-y-6">
              <div className="border-l-4 border-[var(--text-primary)] pl-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Invoice Information
                </h3>
              </div>

              {/* Invoice Number */}
              <div className="space-y-2">
                <label className="flex text-sm font-medium text-[var(--text-muted)] items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Invoice Number
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={invoiceData?.invoiceNoLabel}
                    onChange={(e) =>
                      handleInvoiceChange("invoiceNoLabel", e.target.value)
                    }
                    className="w-32 px-3 py-2 text-sm font-medium text-[var(--text-muted)] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:border-transparent transition-all duration-200"
                    placeholder="Invoice No:"
                  />
                  <input
                    type="text"
                    placeholder="ACI0023"
                    value={invoiceData?.invoiceNo}
                    onChange={(e) =>
                      handleInvoiceChange("invoiceNo", e.target.value)
                    }
                    className="flex-1 px-4 py-3 text-[var(--text-primary)] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Invoice Date */}
              <div className="space-y-2">
                <label className="flex text-sm font-medium text-[var(--text-muted)] items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Invoice Date
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={invoiceData?.invoiceDateLabel}
                    onChange={(e) =>
                      handleInvoiceChange("invoiceDateLabel", e.target.value)
                    }
                    className="w-32 px-3 py-2 text-sm font-medium text-[var(--text-muted)] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:border-transparent transition-all duration-200"
                    placeholder="Date:"
                  />
                  <input
                    type="date"
                    placeholder="Date"
                    value={invoiceData?.invoiceDate}
                    onChange={(e) =>
                      handleInvoiceChange("invoiceDate", e.target.value)
                    }
                    onClick={(e) => e.currentTarget.showPicker()}
                    className="flex-1 px-4 py-3 text-[var(--text-primary)] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:border-transparent transition-all duration-200 cursor-pointer"
                  />
                </div>
              </div>

              {/* Custom Fields */}
              {invoiceData?.customFields.map((field, index) => (
                <div key={index} className="space-y-2 group">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      name="label"
                      value={field?.label}
                      onChange={(e) =>
                        updateCustomField(index, "label", e.target.value)
                      }
                      placeholder="Field Label"
                      className="w-32 px-3 py-2 text-sm font-medium text-[var(--text-muted)] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:border-transparent transition-all duration-200"
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        name="value"
                        value={field?.value}
                        onChange={(e) =>
                          updateCustomField(index, "value", e.target.value)
                        }
                        placeholder="Field Value"
                        className="flex-1 px-4 py-3 text-[var(--text-primary)] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      />
                      <button
                        onClick={() => removeCustomField(index)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        aria-label="Remove field"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Custom Field */}
              <button
                onClick={addCustomField}
                className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm font-medium transition-colors mt-2 p-2 hover:bg-gray-50 rounded-lg"
              >
                <PlusCircle size={16} />
                <span>Add custom field</span>
              </button>
            </div>

            {/* Right Column - Logo Area */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[var(--text-primary)] hover:bg-gray-50 transition-all duration-200 cursor-pointer group">
                <Upload
                  size={24}
                  className="text-gray-400 group-hover:text-[var(--text-primary)] transition-colors mb-2"
                />
                <p className="text-xs text-gray-500 text-center">
                  Company Logo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
