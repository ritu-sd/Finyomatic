import React from "react";

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

export const Title = ({ invoiceData }) => {
  return (
    <div className="text-center mb-8">
      <div className="relative inline-block">
        <input
          type="text"
          value={invoiceData?.invoiceTitle}
          onChange={(e) => handleInvoiceChange("invoiceTitle", e.target.value)}
          className="text-3xl font-bold text-[var(--text-primary)] bg-transparent border-2 border-dashed border-gray-300 rounded-lg px-6 py-3 text-center w-full max-w-md mx-auto focus:outline-none focus:border-[var(--text-primary)] focus:border-solid hover:border-gray-400 transition-all duration-200 cursor-text"
          placeholder="INVOICE"
        />
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-[var(--text-primary)] rounded-full flex items-center justify-center">
          <Pencil className="w-2.5 h-2.5 text-white" />
        </div>
      </div>
    </div>
  );
};
