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

  // Common select styles for consistency
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
      zIndex: 9999, // High z-index to ensure dropdown appears on top
      backgroundColor: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "200px", // Limit height for better UX
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
              Your Details
            </h2>
          </div>

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
                onChange={handleInputChange}
                value={usersBillingInfo?.businessName || ""}
                name="businessName"
                placeholder="User Business Name (required)"
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
                onChange={handleInputChange}
                value={usersBillingInfo?.phoneNumber || ""}
                name="phoneNumber"
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
                onChange={handleInputChange}
                value={usersBillingInfo?.email || ""}
                name="email"
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
                onChange={handleInputChange}
                value={usersBillingInfo?.tax || ""}
                name="tax"
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
                onChange={handleInputChange}
                name="pan"
                value={usersBillingInfo?.pan || ""}
                placeholder="PAN (optional)"
                className="w-full pl-10 py-2 sm:py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#136db2] focus:border-transparent transition-all text-gray-800 text-sm"
              />
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label className="block mb-1 sm:mb-2 text-sm font-medium text-gray-600">
              Address
            </label>
            <div className="relative">
              <div className="absolute top-2 sm:top-3 left-3 flex items-start pointer-events-none">
                <MapPin size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                onChange={handleInputChange}
                name="address"
                value={usersBillingInfo?.address || ""}
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
                onChange={handleInputChange}
                name="city"
                value={usersBillingInfo?.city || ""}
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
                onChange={handleInputChange}
                value={usersBillingInfo?.state || ""}
                name="state"
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
                onChange={handleInputChange}
                name="pinCode"
                value={usersBillingInfo?.pinCode || ""}
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
                menuPortalTarget={document.body} // Render dropdown in body
                menuPosition="absolute"
                menuPlacement="auto" // Automatically choose best position
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
