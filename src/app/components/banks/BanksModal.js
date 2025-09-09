import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";

const customStyles = {
  content: {
    zIndex: 1000,
    background: "#ffffff",
    color: "black",
    borderRadius: "8px",
    outline: "none",
    padding: 0,
    height: "auto",
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

export const BanksModal = ({
  mode,
  open,
  onClose,
  onSuccess,
  existingBank,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [bank, setBank] = useState({
    bankName: existingBank?.bankName || "",
    accountName: existingBank?.accountName || "",
    accountNumber: existingBank?.accountNumber || "",
    ifscCode: existingBank?.ifscCode || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (existingBank) {
      setBank({
        bankName: existingBank.bankName || "",
        accountName: existingBank.accountName || "",
        accountNumber: existingBank.accountNumber || "",
        ifscCode: existingBank.ifscCode || "",
      });
    }
  }, [existingBank]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBank((prevBank) => ({
      ...prevBank,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const requestBody = { ...bank };
      if (mode === "edit" && existingBank) {
        requestBody.id = existingBank.id;
      }

      const response = await fetch("/api/bank", {
        method: mode === "add" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        toast.success(
          mode === "add"
            ? "Bank details added successfully!"
            : "Bank details updated successfully!"
        );
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();

        if (response.status === 409) {
          toast.error(errorData.error || "Account Number already exists");
        } else if (response.status === 400) {
          toast.error(errorData.error || "Please fill in all required fields");
        } else {
          toast.error(errorData.error || "Failed to save Account Details");
        }
      }
    } catch (error) {
      console.error("Error saving bank details:", error);
      toast.error("Failed to save bank details");
    }
  };

  const isSubmitDisabled = () => {
    return (
      !bank.bankName ||
      !bank.accountName ||
      !bank.accountNumber ||
      !bank.ifscCode ||
      isSubmitting
    );
  };

  if (!isClient) {
    return null;
  }

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      ariaHideApp={false}
      contentLabel={mode === "add" ? "Add Bank Details" : "Edit Bank Details"}
      style={customStyles}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={false}
      className="w-[90%] md:w-[50%] max-w-2xl z-[9999]"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "add" ? "Add Bank Details" : "Edit Bank Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 p-6">
          <div className="space-y-6">
            {/* Bank Name */}
            <div>
              <label
                htmlFor="bankName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bank Name *
              </label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={bank.bankName}
                onChange={handleInputChange}
                placeholder="Enter bank name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Account Holder Name */}
            <div>
              <label
                htmlFor="accountName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Account Holder Name *
              </label>
              <input
                type="text"
                id="accountName"
                name="accountName"
                value={bank.accountName}
                onChange={handleInputChange}
                placeholder="Enter account holder name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Account Number */}
            <div>
              <label
                htmlFor="accountNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Account Number *
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={bank.accountNumber}
                onChange={handleInputChange}
                placeholder="Enter account number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* IFSC Code */}
            <div>
              <label
                htmlFor="ifscCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                IFSC Code *
              </label>
              <input
                type="text"
                id="ifscCode"
                name="ifscCode"
                value={bank.ifscCode}
                onChange={handleInputChange}
                placeholder="Enter IFSC code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                required
                style={{ textTransform: "uppercase" }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled()}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitDisabled()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting
                ? "Saving..."
                : mode === "add"
                ? "Add Bank Details"
                : "Update Bank Details"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
