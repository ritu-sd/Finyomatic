"use client";
import React, { useEffect, useState } from "react";
import countryList from "react-select-country-list";
import Select from "react-select";
import {
  Building,
  Phone,
  Mail,
  FileText,
  MapPin,
  Hash,
  Map,
} from "lucide-react";

export const ClientForm = ({
  setClientsBillingInfo,
  handleInputChangeClient,
  clientsBillingInfo,
}) => {
  const [savedClients, setSavedClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/clientslist");

      if (!response.ok) {
        if (response.status === 401) {
          console.warn("User not authenticated, cannot fetch saved clients");
          setSavedClients([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const text = await response.text();
      if (!text) {
        console.warn("Empty response from /api/clientslist");
        setSavedClients([]);
        return;
      }

      const result = JSON.parse(text);
      if (result.error) {
        console.warn("API returned error:", result.error);
        setSavedClients([]);
        return;
      }

      const { data, total } = result;
      if (Array.isArray(data)) {
        setSavedClients(data);
      } else {
        console.warn("API response data is not an array:", data);
        setSavedClients([]);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setSavedClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientSelect = (selectedOption) => {
    const clientId = selectedOption ? selectedOption.value : "";
    setSelectedClient(clientId);

    if (!clientId) {
      // Clear form if no client selected
      const emptyUpdates = {
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
      };
      Object.entries(emptyUpdates).forEach(([name, value]) => {
        handleInputChangeClient({ target: { name, value } });
      });
      return;
    }

    const selected = savedClients.find((client) => client.id === clientId);
    if (selected) {
      const updates = {
        businessName: selected.name || "",
        phoneNumber: selected.phone || "",
        email: selected.email || "",
        country: selected.country || countryList().getLabel("IN"),
        state: selected.state || "",
        city: selected.city || "",
        address: selected.address || "",
        pinCode: selected.postalCode || "",
        tax: selected.taxInformation || "",
        pan: selected.taxId || "",
      };

      Object.entries(updates).forEach(([name, value]) => {
        handleInputChangeClient({ target: { name, value } });
      });
    }
  };

  const handleCountrySelect = (selectedOption) => {
    const countryValue = selectedOption
      ? selectedOption.value
      : countryList().getLabel("IN");
    handleInputChangeClient({
      target: { name: "country", value: countryValue },
    });
  };

  // Enhanced select styles with better visibility
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      padding: "0.125rem 0",
      fontSize: "0.875rem",
      minHeight: "2.5rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#e5e7eb",
      },
      ...(state.isFocused && {
        borderColor: "#136db2",
        boxShadow: "0 0 0 2px rgba(19, 109, 178, 0.2)",
      }),
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      backgroundColor: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "200px",
      padding: "4px",
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "0.875rem",
      padding: "8px 12px",
      borderRadius: "0.375rem",
      margin: "2px 0",
      backgroundColor: state.isSelected
        ? "#136db2"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      "&:hover": {
        backgroundColor: state.isSelected ? "#136db2" : "#f3f4f6",
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
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: "#e5e7eb",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#9ca3af",
      "&:hover": {
        color: "#6b7280",
      },
    }),
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex-1 w-full">
      <div className="h-1.5"></div>

      <div className="p-4 sm:p-6">
        <div className="border-b border-gray-100 pb-2 sm:pb-3 mb-4 sm:mb-6 flex items-center justify-between flex-col gap-3 md:gap-0 md:flex-row">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-violet-100 to-indigo-100 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
              <Building size={16} className="text-[#136db2] sm:hidden" />
              <Building size={18} className="text-[#136db2] hidden sm:block" />
            </div>
            <h2 className="text-base sm:text-lg font-medium text-gray-800">
              Client Information
            </h2>
          </div>

          <div className="w-64">
            {isClient && (
              <Select
                instanceId="saved-clients-select"
                options={savedClients.map((client) => ({
                  value: client.id,
                  label: client.name,
                }))}
                onChange={handleClientSelect}
                value={
                  savedClients.find((client) => client.id === selectedClient)
                    ? {
                        value: selectedClient,
                        label: savedClients.find(
                          (client) => client.id === selectedClient
                        )?.name,
                      }
                    : null
                }
                isDisabled={isLoading}
                placeholder="Select Saved Client"
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
                styles={selectStyles}
                menuPortalTarget={document.body}
                menuPosition="absolute"
                menuPlacement="auto"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-4 sm:gap-y-5">
          <div className="col-span-1 sm:col-span-2">
            <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-600">
              Business Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                onChange={handleInputChangeClient}
                name="businessName"
                value={clientsBillingInfo?.businessName || ""}
                placeholder="Client Business Name (required)"
                className="w-full pl-10 py-2 sm:py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#136db2] focus:border-transparent transition-all text-gray-800 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-600">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={16} className="text-gray-400" />
              </div>
              <input
                type="tel"
                onChange={handleInputChangeClient}
                name="phoneNumber"
                value={clientsBillingInfo?.phoneNumber || ""}
                placeholder="Phone Number"
                className="w-full pl-10 py-2 sm:py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#136db2] focus:border-transparent transition-all text-gray-800 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-600">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={16} className="text-gray-400" />
              </div>
              <input
                type="email"
                onChange={handleInputChangeClient}
                name="email"
                value={clientsBillingInfo?.email || ""}
                placeholder="Email (Optional)"
                className="w-full pl-10 py-2 sm:py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#136db2] focus:border-transparent transition-all text-gray-800 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-600">
              Tax Information
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                onChange={handleInputChangeClient}
                name="tax"
                value={clientsBillingInfo?.tax || ""}
                placeholder="Tax Registration Number (optional)"
                className="w-full pl-10 py-2 sm:py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#136db2] focus:border-transparent transition-all text-gray-800 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-600">
              PAN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                onChange={handleInputChangeClient}
                name="pan"
                value={clientsBillingInfo?.pan || ""}
                placeholder="PAN (optional)"
                className="w-full pl-10 py-2 sm:py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#136db2] focus:border-transparent transition-all text-gray-800 text-sm"
              />
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label className="block mb-1 sm:mb-2 text-z font-medium text-gray-600">
              Address
            </label>
            <div className="relative">
              <div className="absolute top-2 sm:top-3 left-3 flex items-start pointer-events-none">
                <MapPin size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                onChange={handleInputChangeClient}
                name="address"
                value={clientsBillingInfo?.address || ""}
                placeholder="Complete Address (optional)"
                className="w-full pl-10 py-2 sm:py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#136db2] focus:border-transparent transition-all text-gray-800 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-600">
              City
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Map size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                onChange={handleInputChangeClient}
                name="city"
                value={clientsBillingInfo?.city || ""}
                placeholder="City (optional)"
                className="w-full pl-10 py-2 sm:py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#136db2] focus:border-transparent transition-all text-gray-800 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-600">
              State
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Map size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                onChange={handleInputChangeClient}
                name="state"
                value={clientsBillingInfo?.state || ""}
                placeholder="State (optional)"
                className="w-full pl-10 py-2 sm:py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#136db2] focus:border-transparent transition-all text-gray-800 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-600">
              PIN / ZIP Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                onChange={handleInputChangeClient}
                name="pinCode"
                value={clientsBillingInfo?.pinCode || ""}
                placeholder="PIN / ZIP Code"
                className="w-full pl-10 py-2 sm:py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#136db2] focus:border-transparent transition-all text-gray-800 text-sm"
              />
            </div>
          </div>
          <div className="mb-4 sm:mb-6 relative">
            <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-600">
              Country
            </label>
            {isClient && (
              <Select
                instanceId="client-country-select"
                options={countryList()
                  .getData()
                  .map((country) => ({
                    value: country.label,
                    label: country.label,
                  }))}
                onChange={handleCountrySelect}
                value={
                  clientsBillingInfo?.country
                    ? {
                        value: clientsBillingInfo.country,
                        label: clientsBillingInfo.country,
                      }
                    : {
                        value: countryList().getLabel("IN"),
                        label: countryList().getLabel("IN"),
                      }
                }
                placeholder="Select Country"
                isSearchable
                className="react-select-container"
                classNamePrefix="react-select"
                styles={selectStyles}
                menuPortalTarget={document.body}
                menuPosition="absolute"
                menuPlacement="auto"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
