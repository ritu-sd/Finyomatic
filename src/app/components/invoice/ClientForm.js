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

  // Updated select styles to match InvoiceHeader minimalistic design
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "none",
      borderBottom: "1px solid #d1d5db",
      borderRadius: "0",
      padding: "0.125rem 0",
      fontSize: "1rem",
      minHeight: "2.5rem",
      boxShadow: "none",
      "&:hover": {
        borderBottomColor: "#9ca3af",
      },
      ...(state.isFocused && {
        borderBottomColor: "var(--text-primary)",
        boxShadow: "none",
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
        ? "var(--text-primary)"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "var(--text-primary)",
      "&:hover": {
        backgroundColor: state.isSelected ? "var(--text-primary)" : "#f3f4f6",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "var(--text-muted)",
      fontSize: "1rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "var(--text-primary)",
      fontSize: "1rem",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: "#e5e7eb",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "var(--text-muted)",
      "&:hover": {
        color: "var(--text-primary)",
      },
    }),
  };

  return (
    <div className="w-full bg-white">
      {/* Client Details Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-8 shadow-sm">
        {/* Header */}
        <div className="flex flex-col justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--text-primary)] rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Client Details
              </h2>
            </div>
          </div>

          <div className="w-full mt-4">
            {isClient && (
              <div className="relative">
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
                  placeholder="Select from saved clients"
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="absolute"
                  menuPlacement="auto"
                />
              </div>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Business Information Section */}
          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Business Information
              </h3>
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <label className="flex text-sm font-medium text-[var(--text-muted)] items-center gap-2">
                <Building className="w-4 h-4" />
                Business Name
              </label>
              <input
                type="text"
                onChange={handleInputChangeClient}
                name="businessName"
                value={clientsBillingInfo?.businessName || ""}
                placeholder="Enter client business name"
                className="w-full px-4 py-3 text-[var(--text-primary)] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="flex text-sm font-medium text-[var(--text-muted)] items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                onChange={handleInputChangeClient}
                name="phoneNumber"
                value={clientsBillingInfo?.phoneNumber || ""}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 text-[var(--text-primary)] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="flex text-sm font-medium text-[var(--text-muted)] items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                onChange={handleInputChangeClient}
                name="email"
                value={clientsBillingInfo?.email || ""}
                placeholder="Enter email address"
                className="w-full px-4 py-3 text-[var(--text-primary)] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Tax & Legal Information Section */}
          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Tax & Legal Information
              </h3>
            </div>

            {/* Tax Information */}
            <div className="space-y-2">
              <label className="flex text-sm font-medium text-[var(--text-muted)] items-center gap-2">
                <Hash className="w-4 h-4" />
                Tax Registration Number
              </label>
              <input
                type="text"
                onChange={handleInputChangeClient}
                name="tax"
                value={clientsBillingInfo?.tax || ""}
                placeholder="Enter tax registration number"
                className="w-full px-4 py-3 text-[var(--text-primary)] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>

            {/* PAN */}
            <div className="space-y-2">
              <label className="flex text-sm font-medium text-[var(--text-muted)] items-center gap-2">
                <FileText className="w-4 h-4" />
                PAN Number
              </label>
              <input
                type="text"
                onChange={handleInputChangeClient}
                name="pan"
                value={clientsBillingInfo?.pan || ""}
                placeholder="Enter PAN number"
                className="w-full px-4 py-3 text-[var(--text-primary)] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="border-l-4 border-blue-600 pl-4 mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address Information
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Address */}
            <div className="lg:col-span-2 space-y-2">
              <label className="flex text-sm font-medium text-[var(--text-muted)] items-center gap-2">
                <MapPin className="w-4 h-4" />
                Complete Address
              </label>
              <input
                type="text"
                onChange={handleInputChangeClient}
                name="address"
                value={clientsBillingInfo?.address || ""}
                placeholder="Enter complete address"
                className="w-full px-4 py-3 text-[var(--text-primary)] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="flex text-sm font-medium text-[var(--text-muted)] items-center gap-2">
                <Map className="w-4 h-4" />
                City
              </label>
              <input
                type="text"
                onChange={handleInputChangeClient}
                name="city"
                value={clientsBillingInfo?.city || ""}
                placeholder="Enter city"
                className="w-full px-4 py-3 text-[var(--text-primary)] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="flex text-sm font-medium text-[var(--text-muted)] items-center gap-2">
                <Map className="w-4 h-4" />
                State
              </label>
              <input
                type="text"
                onChange={handleInputChangeClient}
                name="state"
                value={clientsBillingInfo?.state || ""}
                placeholder="Enter state"
                className="w-full px-4 py-3 text-[var(--text-primary)] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>

            {/* PIN Code */}
            <div className="space-y-2">
              <label className="flex text-sm font-medium text-[var(--text-muted)] items-center gap-2">
                <Hash className="w-4 h-4" />
                PIN Code
              </label>
              <input
                type="text"
                onChange={handleInputChangeClient}
                name="pinCode"
                value={clientsBillingInfo?.pinCode || ""}
                placeholder="Enter PIN code"
                className="w-full px-4 py-3 text-[var(--text-primary)] bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="flex text-sm font-medium text-[var(--text-muted)] items-center gap-2">
                <Map className="w-4 h-4" />
                Country
              </label>
              <div className="w-full">
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
                    styles={{
                      ...selectStyles,
                      control: (provided, state) => ({
                        ...selectStyles.control(provided, state),
                        minHeight: "3rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #d1d5db",
                        "&:hover": {
                          borderColor: "#9ca3af",
                        },
                        ...(state.isFocused && {
                          borderColor: "#2563eb",
                          boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.1)",
                        }),
                      }),
                    }}
                    menuPortalTarget={document.body}
                    menuPosition="absolute"
                    menuPlacement="auto"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
