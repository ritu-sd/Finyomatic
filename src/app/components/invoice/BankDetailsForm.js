"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";

export const BankDetailsForm = ({
  setBankDetails,
  handleInputChange,
  bankDetails,
}) => {
  const [savedBanks, setSavedBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchBanks();
  }, []);

  useEffect(() => {
    const hasBankData =
      bankDetails?.bankName ||
      bankDetails?.accountName ||
      bankDetails?.accountNumber ||
      bankDetails?.ifscCode;
    setIsAccordionOpen(hasBankData);
  }, [bankDetails]);

  const fetchBanks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/banklist");

      if (!response.ok) {
        if (response.status === 401) {
          console.warn(
            "User not authenticated, cannot fetch saved bank details"
          );
          setSavedBanks([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        console.warn("API returned error:", result.error);
        setSavedBanks([]);
        return;
      }

      const { data } = result;

      if (Array.isArray(data)) {
        setSavedBanks(data);
      } else {
        console.warn("API response data is not an array:", data);
        setSavedBanks([]);
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
      setSavedBanks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankSelect = (selectedOption) => {
    const bankId = selectedOption ? selectedOption.value : "";
    setSelectedBank(bankId);

    if (!bankId) {
      // Clear form if no bank selected
      const emptyUpdates = {
        bankName: "",
        accountName: "",
        accountNumber: "",
        ifscCode: "",
      };
      Object.entries(emptyUpdates).forEach(([name, value]) => {
        handleInputChange({ target: { name, value } });
      });
      return;
    }

    const selected = savedBanks.find((bank) => bank.id === bankId);
    if (selected) {
      const updates = {
        bankName: selected.bankName || "",
        accountName: selected.accountName || "",
        accountNumber: selected.accountNumber || "",
        ifscCode: selected.ifscCode || "",
      };

      Object.entries(updates).forEach(([name, value]) => {
        handleInputChange({ target: { name, value } });
      });
    }
  };

  // Toggle accordion
  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  // Check if any bank details are filled
  const hasBankDetails =
    bankDetails?.bankName ||
    bankDetails?.accountName ||
    bankDetails?.accountNumber ||
    bankDetails?.ifscCode;

  // Updated select styles to match the new blue color scheme
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "white",
      border: "1px solid #d1d5db",
      borderRadius: "0.5rem",
      padding: "0.25rem 0",
      fontSize: "0.875rem",
      minHeight: "2.75rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#9ca3af",
      },
      ...(state.isFocused && {
        borderColor: "#05294d",
        boxShadow: "0 0 0 3px rgba(5, 41, 77, 0.1)",
      }),
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "0.875rem",
      backgroundColor: state.isSelected
        ? "#05294d"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      "&:hover": {
        backgroundColor: state.isSelected ? "#05294d" : "#f3f4f6",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "0.875rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#374151",
      fontSize: "0.875rem",
    }),
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
      {/* Accordion Header */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={toggleAccordion}
      >
        <div className="flex items-center">
          <div className="bg-[#2684db]/10 p-2 rounded-lg mr-3">
            <svg
              className="w-5 h-5 text-[#05294d]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Bank Details
              </h3>
              <span className="ml-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Optional
              </span>
              {hasBankDetails && (
                <span className="ml-2 text-xs font-medium text-[#0d5696] bg-[#2684db]/10 px-2 py-1 rounded-full border border-[#2684db]/20">
                  Added
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Add your banking information for payment processing
            </p>
          </div>
        </div>

        {/* Accordion Toggle Icon */}
        <div className="flex items-center">
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              isAccordionOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Accordion Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isAccordionOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 border-t border-gray-100">
          {/* Saved Banks Dropdown - Always show if there are saved banks */}
          {
            <div className="mb-6 mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select from Saved Banks
              </label>
              {isClient && (
                <Select
                  instanceId="saved-banks-select"
                  options={savedBanks.map((bank) => ({
                    value: bank.id,
                    label: bank.bankName,
                  }))}
                  onChange={handleBankSelect}
                  value={
                    savedBanks.find((bank) => bank.id === selectedBank)
                      ? {
                          value: selectedBank,
                          label: savedBanks.find(
                            (bank) => bank.id === selectedBank
                          )?.bankName,
                        }
                      : null
                  }
                  isDisabled={isLoading}
                  placeholder="Select saved bank..."
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={selectStyles}
                />
              )}
            </div>
          }

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bank Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  onChange={handleInputChange}
                  name="bankName"
                  value={bankDetails?.bankName}
                  placeholder="Enter bank name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#136db2] focus:border-transparent transition-colors duration-200 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Holder Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  onChange={handleInputChange}
                  name="accountName"
                  value={bankDetails?.accountName}
                  placeholder="Enter account holder name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2  focus:ring-[#136db2]  focus:border-transparent transition-colors duration-200 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  onChange={handleInputChange}
                  name="accountNumber"
                  value={bankDetails?.accountNumber}
                  placeholder="Enter account number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2  focus:ring-[#136db2]  focus:border-transparent transition-colors duration-200 placeholder-gray-400"
                />
              </div>
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <input
                  type="text"
                  onChange={handleInputChange}
                  name="ifscCode"
                  value={bankDetails?.ifscCode}
                  placeholder="Enter IFSC code"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2  focus:ring-[#136db2]  focus:border-transparent transition-colors duration-200 placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
