import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Select from "react-select";
import countryList from "react-select-country-list";

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

export const ClientsModal = ({
  mode,
  open,
  onClose,
  onSuccess,
  existingClient,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [client, setClient] = useState({
    name: existingClient?.name || "",
    phone: existingClient?.phone || "",
    email: existingClient?.email || "",
    country: existingClient?.country || countryList().getLabel("IN"),
    state: existingClient?.state || "",
    city: existingClient?.city || "",
    address: existingClient?.address || "",
    pincode: existingClient?.postalCode || "",
    taxid: existingClient?.taxInformation || "",
    pan: existingClient?.taxId || "",
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
    setClient((prevClient) => ({
      ...prevClient,
      [name]: value,
    }));
  };
  const addNewClient = async (event) => {
    event.preventDefault();
    const requestBody = client;
    if (mode === "edit" && existingClient) {
      requestBody.id = existingClient.id;
    }
    const response = await fetch("/api/clients", {
      method: mode === "add" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    if (response.ok) {
      onSuccess();
      onClose();
    } else {
      console.error("Failed to add/edit client");
    }
  };

  const isSubmitDisabled = () => {
    return !client.name || !client.phone || !client.email;
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      contentLabel="Add/Edit Client"
      style={customStyles}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={false}
      className="w-[90%] md:w-[50%] h-2/3 z-[9999] max-w-full"
      ariaHideApp={false}
      parentSelector={() => document.querySelector("body")}
      preventScroll={true}
    >
      <div className="p-6">
        <div className="">
          <h2 className="font-bold text-lg mb-4">
            {mode === "add" ? "Add Client" : "Edit Client"}
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
                  value={client.name}
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Phone"
                  name="phone"
                  className="input input-bordered"
                  onChange={handleInputChange}
                  value={client.phone}
                />
              </div>
              <div className="form-control">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  className="input input-bordered"
                  onChange={handleInputChange}
                  value={client.email}
                />
              </div>
              <div className="form-control">
                {isClient && (
                  <Select
                    instanceId="client-country-modal-select"
                    options={countryOptions}
                    value={countryOptions.find(
                      (option) => option.value === client.country
                    )}
                    onChange={(selectedOption) =>
                      setClient((prevClient) => ({
                        ...prevClient,
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
                  value={client.state}
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  className="input input-bordered"
                  onChange={handleInputChange}
                  value={client.city}
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Address"
                  name="address"
                  className="input input-bordered"
                  onChange={handleInputChange}
                  value={client.address}
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="PIN Code"
                  name="pincode"
                  className="input input-bordered"
                  onChange={handleInputChange}
                  value={client.pincode}
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Tax ID"
                  name="taxid"
                  className="input input-bordered"
                  onChange={handleInputChange}
                  value={client.taxid}
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="PAN"
                  name="pan"
                  className="input input-bordered"
                  onChange={handleInputChange}
                  value={client.pan}
                />
              </div>
            </div>
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
                onClick={addNewClient}
                disabled={isSubmitDisabled()}
              >
                {mode === "add" ? "Add Client" : "Update Client"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
