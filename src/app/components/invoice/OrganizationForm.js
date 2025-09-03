"use client";
import { React, useState, useEffect } from "react";
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

export const OrganizationForm = ({
  setUsersBillingInfo,
  handleInputChange,
  usersBillingInfo,
}) => {
  const [savedUsers, setSavedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/organizationlist");

      // Check if the response is ok
      if (!response.ok) {
        if (response.status === 401) {
          console.warn("User not authenticated, cannot fetch saved users");
          setSavedUsers([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has content
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const text = await response.text();
      if (!text) {
        console.warn("Empty response from /api/organizationlist");
        setSavedUsers([]);
        return;
      }

      const result = JSON.parse(text);

      // Handle error responses
      if (result.error) {
        console.warn("API returned error:", result.error);
        setSavedUsers([]);
        return;
      }

      const { data, total } = result;

      if (Array.isArray(data)) {
        setSavedUsers(data);
      } else {
        console.warn("API response data is not an array:", data);
        setSavedUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setSavedUsers([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (selectedOption) => {
    const userId = selectedOption ? selectedOption.value : "";
    setSelectedUser(userId);

    if (!userId) {
      // Clear form if no user selected
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
        signature: null,
      };
      Object.entries(emptyUpdates).forEach(([name, value]) => {
        handleInputChange({ target: { name, value } });
      });
      return;
    }

    const selected = savedUsers.find((user) => user.id === userId);
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
        signature: selected.signature || null,
      };

      Object.entries(updates).forEach(([name, value]) => {
        handleInputChange({ target: { name, value } });
      });
    }
  };

  const handleCountrySelect = (selectedOption) => {
    const countryValue = selectedOption
      ? selectedOption.value
      : countryList().getLabel("IN");
    handleInputChange({ target: { name: "country", value: countryValue } });
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
    <div className="max-w-4xl mx-auto bg-white">
      {/* Organization Details Section */}
      <div className="border-b-2 border-gray-300 pb-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--text-primary)] rounded-full"></div>
            Organization Details
          </h2>

          <div className="w-64">
            {isClient && (
              <Select
                instanceId="saved-users-select"
                options={savedUsers.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                onChange={handleUserSelect}
                value={
                  savedUsers.find((user) => user.id === selectedUser)
                    ? {
                        value: selectedUser,
                        label: savedUsers.find(
                          (user) => user.id === selectedUser
                        )?.name,
                      }
                    : null
                }
                isDisabled={isLoading}
                placeholder="Select Saved Users"
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
                styles={selectStyles}
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Business Name */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[var(--text-muted)] min-w-24">
              Business Name:
            </label>
            <input
              type="text"
              onChange={handleInputChange}
              value={usersBillingInfo?.businessName || ""}
              name="businessName"
              placeholder="Enter business name"
              className="flex-1 text-lg font-semibold text-[var(--text-primary)] bg-transparent border-b border-gray-300 focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
          </div>

          {/* Phone Number */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[var(--text-muted)] min-w-24">
              Phone Number:
            </label>
            <input
              type="tel"
              onChange={handleInputChange}
              value={usersBillingInfo?.phoneNumber || ""}
              name="phoneNumber"
              placeholder="Enter phone number"
              className="flex-1 text-lg font-semibold text-[var(--text-primary)] bg-transparent border-b border-gray-300 focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[var(--text-muted)] min-w-24">
              Email:
            </label>
            <input
              type="email"
              onChange={handleInputChange}
              value={usersBillingInfo?.email || ""}
              name="email"
              placeholder="Enter email address"
              className="flex-1 text-lg font-semibold text-[var(--text-primary)] bg-transparent border-b border-gray-300 focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
          </div>

          {/* Tax Information */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[var(--text-muted)] min-w-24">
              Tax Info:
            </label>
            <input
              type="text"
              onChange={handleInputChange}
              value={usersBillingInfo?.tax || ""}
              name="tax"
              placeholder="Enter tax registration number"
              className="flex-1 text-lg font-semibold text-[var(--text-primary)] bg-transparent border-b border-gray-300 focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
          </div>

          {/* PAN */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[var(--text-muted)] min-w-24">
              PAN:
            </label>
            <input
              type="text"
              onChange={handleInputChange}
              name="pan"
              value={usersBillingInfo?.pan || ""}
              placeholder="Enter PAN number"
              className="flex-1 text-lg font-semibold text-[var(--text-primary)] bg-transparent border-b border-gray-300 focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
          </div>

          {/* Address */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[var(--text-muted)] min-w-24">
              Address:
            </label>
            <input
              type="text"
              onChange={handleInputChange}
              name="address"
              value={usersBillingInfo?.address || ""}
              placeholder="Enter complete address"
              className="flex-1 text-lg font-semibold text-[var(--text-primary)] bg-transparent border-b border-gray-300 focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
          </div>

          {/* City */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[var(--text-muted)] min-w-24">
              City:
            </label>
            <input
              type="text"
              onChange={handleInputChange}
              name="city"
              value={usersBillingInfo?.city || ""}
              placeholder="Enter city"
              className="flex-1 text-lg font-semibold text-[var(--text-primary)] bg-transparent border-b border-gray-300 focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
          </div>

          {/* State */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[var(--text-muted)] min-w-24">
              State:
            </label>
            <input
              type="text"
              onChange={handleInputChange}
              value={usersBillingInfo?.state || ""}
              name="state"
              placeholder="Enter state"
              className="flex-1 text-lg font-semibold text-[var(--text-primary)] bg-transparent border-b border-gray-300 focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
          </div>

          {/* PIN Code */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[var(--text-muted)] min-w-24">
              PIN Code:
            </label>
            <input
              type="text"
              onChange={handleInputChange}
              name="pinCode"
              value={usersBillingInfo?.pinCode || ""}
              placeholder="Enter PIN code"
              className="flex-1 text-lg font-semibold text-[var(--text-primary)] bg-transparent border-b border-gray-300 focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
          </div>

          {/* Country */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[var(--text-muted)] min-w-24">
              Country:
            </label>
            <div className="flex-1">
              {isClient && (
                <Select
                  instanceId="country-select"
                  options={countryList()
                    .getData()
                    .map((country) => ({
                      value: country.label,
                      label: country.label,
                    }))}
                  onChange={handleCountrySelect}
                  value={{
                    value:
                      usersBillingInfo?.country || countryList().getLabel("IN"),
                    label:
                      usersBillingInfo?.country || countryList().getLabel("IN"),
                  }}
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
    </div>
  );
};
