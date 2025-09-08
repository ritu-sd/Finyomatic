"use client";

import { useState, useEffect } from "react";
import { Upload, PlusCircle, X, Trash2 } from "lucide-react";

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
    <div className="w-full bg-white mt-4">
      {/* Invoice Title */}
      <div className="text-center mb-8">
        <input
          type="text"
          value={invoiceData?.invoiceTitle}
          onChange={(e) => handleInvoiceChange("invoiceTitle", e.target.value)}
          className="text-3xl font-bold text-[var(--text-primary)] bg-transparent border-none focus:outline-none text-center w-full max-w-md mx-auto"
          placeholder="INVOICE"
        />
      </div>

      {/* Invoice Header Section */}
      <div className="border-b-2 border-gray-300 pb-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Invoice Details */}
          <div className="space-y-4">
            {/* Invoice Number */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-[var(--text-muted)] min-w-20">
                <input
                  type="text"
                  value={invoiceData?.invoiceNoLabel}
                  onChange={(e) =>
                    handleInvoiceChange("invoiceNoLabel", e.target.value)
                  }
                  className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-[var(--text-muted)]"
                  placeholder="Invoice No:"
                />
              </label>
              <input
                type="text"
                placeholder="ACI0023"
                value={invoiceData?.invoiceNo}
                onChange={(e) =>
                  handleInvoiceChange("invoiceNo", e.target.value)
                }
                className="flex-1 text-lg font-semibold text-[var(--text-primary)] bg-transparent border-b border-gray-300 focus:outline-none focus:border-[var(--text-primary)] transition-colors"
              />
            </div>

            {/* Invoice Date */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-[var(--text-muted)] min-w-20">
                <input
                  type="text"
                  value={invoiceData?.invoiceDateLabel}
                  onChange={(e) =>
                    handleInvoiceChange("invoiceDateLabel", e.target.value)
                  }
                  className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-[var(--text-muted)]"
                  placeholder="Date:"
                />
              </label>
              <input
                type="date"
                placeholder="Date"
                value={invoiceData?.invoiceDate}
                onChange={(e) =>
                  handleInvoiceChange("invoiceDate", e.target.value)
                }
                onClick={(e) => e.currentTarget.showPicker()}
                className="flex-1 text-lg font-semibold text-[var(--text-primary)] bg-transparent border-b border-gray-300 focus:outline-none focus:border-[var(--text-primary)] transition-colors cursor-pointer"
              />
            </div>

            {/* Custom Fields */}
            {invoiceData?.customFields.map((field, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="min-w-20">
                  <input
                    type="text"
                    name="label"
                    value={field?.label}
                    onChange={(e) =>
                      updateCustomField(index, "label", e.target.value)
                    }
                    placeholder="Field:"
                    className="w-full text-sm font-medium text-[var(--text-muted)] bg-transparent border-none focus:outline-none"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    name="value"
                    value={field?.value}
                    onChange={(e) =>
                      updateCustomField(index, "value", e.target.value)
                    }
                    placeholder="Value"
                    className="flex-1 text-lg font-semibold text-[var(--text-primary)] bg-transparent border-b border-gray-300 focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                  />
                  <button
                    onClick={() => removeCustomField(index)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all duration-200"
                    aria-label="Remove field"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* Add Custom Field */}
            <button
              onClick={addCustomField}
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm font-medium transition-colors mt-2"
            >
              <PlusCircle size={16} />
              <span>Add field</span>
            </button>
          </div>

          {/* Right Column - Logo Area */}
          <div className="flex justify-end">
            <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[var(--text-primary)] transition-colors cursor-pointer group">
              <Upload
                size={24}
                className="text-gray-400 group-hover:text-[var(--text-primary)] transition-colors mb-2"
              />
              <p className="text-xs text-gray-500 text-center">Company Logo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
