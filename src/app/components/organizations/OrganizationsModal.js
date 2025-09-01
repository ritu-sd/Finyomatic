import { Currency } from "lucide-react";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Select from "react-select";
import countryList from "react-select-country-list";
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

export const OrganizationsModal = ({
  mode,
  open,
  onClose,
  onSuccess,
  existingOrganization,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [organization, setOrganization] = useState({
    name: existingOrganization?.name || "",
    email: existingOrganization?.email || "",
    phone: existingOrganization?.phone || "",
    gstin: existingOrganization?.gstin || "",
    pan: existingOrganization?.pan || "",
    country: existingOrganization?.country || countryList().getLabel("IN"),
    state: existingOrganization?.state || "",
    city: existingOrganization?.city || "",
    pincode: existingOrganization?.postal_code || "",
    address_line1: existingOrganization?.address_line1 || "",
    address_line2: existingOrganization?.address_line2 || "",
    currency: existingOrganization?.currency || "INR",
    logo_url: existingOrganization?.logo_url || "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const countryOptions = countryList()
    .getData()
    .map((country) => ({
      value: country.label,
      label: country.label,
    }));
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setOrganization((prevOrganization) => ({
      ...prevOrganization,
      [name]: value,
    }));
  };
  const addNewUser = async (event) => {
    event.preventDefault();
    const requestBody = organization;
    if (mode === "edit" && existingOrganization) {
      requestBody.id = existingOrganization.id;
    }

    try {
      const response = await fetch("/api/organizations", {
        method: mode === "add" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        toast.success(
          mode === "add"
            ? "Organization created successfully!"
            : "Organization updated successfully!"
        );
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();

        if (response.status === 409) {
          toast.error(errorData.error || "Organization already exists");
        } else if (response.status === 400) {
          toast.error(errorData.error || "Please fill in all required fields");
        } else {
          toast.error(errorData.error || "Failed to save organization");
        }
      }
    } catch (error) {
      console.error("Error saving organization:", error);
      toast.error("Failed to save organization. Please try again.");
    }
  };

  const handleSignatureChange = (signatureData) => {
    setOrganization((prevOrganization) => ({
      ...prevOrganization,
      signature: signatureData,
    }));
  };

  const isSubmitDisabled = () => {
    return !organization.name || !organization.phone || !organization.email;
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      contentLabel="Add/Edit Organization"
      style={customStyles}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={false}
      className="w-[90%] md:w-[50%] h-2/3 z-[9999] max-w-full"
      ariaHideApp={false}
      parentSelector={() => document.querySelector("body")}
      preventScroll={true}
    >
      <div className="w-full h-full p-6">
        <div className="">
          <h2 className="font-bold text-lg mb-4">
            {mode === "add" ? "Add organization" : "Edit organization"}
          </h2>
          <form>
            <div className="flex flex-col gap-4">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Business Name"
                  name="name"
                  className="input input-bordered"
                  onChange={handleInputChange}
                  value={organization.name}
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Phone"
                  name="phone"
                  className="input input-bordered"
                  onChange={handleInputChange}
                  value={organization.phone}
                />
              </div>
              <div className="form-control">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  className="input input-bordered"
                  onChange={handleInputChange}
                  value={organization.email}
                />
              </div>
              <div className="form-control">
                {isClient && (
                  <Select
                    instanceId="user-country-select"
                    options={countryOptions}
                    value={countryOptions.find(
                      (option) => option.value === organization.country
                    )}
                    onChange={(selectedOption) =>
                      setOrganization((prevOrganization) => ({
                        ...prevOrganization,
                        country: selectedOption?.value || "",
                      }))
                    }
                    placeholder="Select Country"
                    className="w-full md:w-80 rounded-3xl"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        minHeight: "3rem",
                        borderColor: "#e5e7eb",
                        "&:hover": {
                          borderColor: "#d1d5db",
                        },
                      }),
                    }}
                  />
                )}
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="State"
                  name="state"
                  className="input input-bordered"
                  onChange={handleInputChange}
                  value={organization.state}
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  className="input input-bordered"
                  onChange={handleInputChange}
                  value={organization.city}
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Address"
                  name="address"
                  className="input input-bordered"
                  onChange={handleInputChange}
                  value={organization.address}
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="PIN Code"
                  name="pincode"
                  className="input input-bordered"
                  onChange={handleInputChange}
                  value={organization.pincode}
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Tax ID"
                  name="taxid"
                  className="input input-bordered"
                  onChange={handleInputChange}
                  value={organization.taxid}
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="PAN"
                  name="pan"
                  className="input input-bordered"
                  onChange={handleInputChange}
                  value={organization.pan}
                />
              </div>
            </div>

            {/* Signature Upload Section
            <div className="form-control mt-6">
              <label className="label">
                <span className="label-text font-medium">Signature</span>
              </label>

              <Signature
                signature={organization.signature}
                onSignatureChange={handleSignatureChange}
                useLocalStorage={false}
                compact={true}
              />
            </div> */}

            <div className="form-control mt-6 flex justify-between items-center">
              <button
                type="button"
                className="btn btn-neutral"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={addNewUser}
                disabled={isSubmitDisabled()}
              >
                {mode === "add" ? "Add Organization" : "Update Organization"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
