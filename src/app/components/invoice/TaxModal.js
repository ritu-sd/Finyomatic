import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Select from "react-select";

const customStyles = {
  content: {
    zIndex: 1000,
    background: "#ffffff",
    color: "black",
    borderRadius: "8px",
    outline: "none",
    padding: 0,
    height: "350px",
    minHeight: "350px",
    position: "relative",
    inset: "initial",
    maxWidth: "75%",
    minWidth: 'max("500px", calc(50%))',
    boxShadow: "0 25px 50px -12px #00000040",
  },
  overlay: {
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0006",
  },
};

export const TaxModal = ({
  modalIsOpen,
  handleCloseModal,
  selectedTaxType = "gst",
  gstType = "cgst_sgst",
  onTaxConfigChange,
}) => {
  const taxOptions = [
    { value: "tax", label: "Tax" },
    { value: "gst", label: "GST" },
  ];

  const [localSelectedTaxType, setLocalSelectedTaxType] = useState(() => {
    const foundOption = taxOptions.find(
      (option) => option.value === selectedTaxType
    );
    return foundOption || taxOptions[1]; // Default to GST (second option) if no valid selectedTaxType provided
  });
  const [localGstType, setLocalGstType] = useState(gstType);

  // Update local state when props change
  useEffect(() => {
    const foundOption = taxOptions.find(
      (option) => option.value === selectedTaxType
    );
    setLocalGstType(gstType);
    setLocalSelectedTaxType(foundOption || taxOptions[1]); // Default to GST only if selectedTaxType is not provided
    setLocalGstType(gstType || "cgst_sgst");
  }, [selectedTaxType, gstType]);

  const handleTaxTypeChange = (selectedOption) => {
    setLocalSelectedTaxType(selectedOption);
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={handleCloseModal}
      style={customStyles}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      className="w-[90%] md:w-[50%] max-w-2xl z-[9999]"
    >
      <div className="h-full flex flex-col">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Tax Configuration
          </h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Tax Type
            </label>
            <Select
              value={localSelectedTaxType}
              onChange={handleTaxTypeChange}
              options={taxOptions}
              placeholder="Choose tax type..."
              className="w-full"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
                  boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : "none",
                  "&:hover": {
                    borderColor: "#6366f1",
                  },
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#6366f1"
                    : state.isFocused
                    ? "#e0e7ff"
                    : "white",
                  color: state.isSelected ? "white" : "#374151",
                }),
              }}
            />
          </div>

          {/* GST Type Selection - Show only when GST is selected */}
          {localSelectedTaxType?.value === "gst" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                GST Type
              </label>
              <div className="flex items-center gap-x-6">
                <div className="flex items-center">
                  <input
                    id="igst"
                    name="gstType"
                    type="radio"
                    value="igst"
                    checked={localGstType === "igst"}
                    onChange={(e) => setLocalGstType(e.target.value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label
                    htmlFor="igst"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    IGST
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="cgst_sgst"
                    name="gstType"
                    type="radio"
                    value="cgst_sgst"
                    checked={localGstType === "cgst_sgst"}
                    onChange={(e) => setLocalGstType(e.target.value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label
                    htmlFor="cgst_sgst"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    CGST & SGST
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Pass the selected configuration back to parent
                if (onTaxConfigChange) {
                  onTaxConfigChange(
                    localSelectedTaxType?.value || "gst",
                    localGstType
                  );
                }
                handleCloseModal();
              }}
              disabled={!localSelectedTaxType}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
