"use client";
import { useState } from "react";
import Select from "react-select";
import currencyToSymbolMap from "currency-symbol-map";

export const CurrencySelector = ({ handleCurrencyChange }) => {
  const currencyData = Object.entries(currencyToSymbolMap);
  const data = currencyData[0][1];

  // Create options array for react-select
  const currencyOptions = Object.entries(data).map(([code, symbol]) => ({
    value: code,
    label: `${code} (${symbol})`,
  }));

  const handleCurrencySelect = (selectedOption) => {
    if (selectedOption && handleCurrencyChange) {
      // Create a synthetic event object to match the original handler's expectations
      const syntheticEvent = {
        target: {
          value: selectedOption.value,
        },
      };
      handleCurrencyChange(syntheticEvent);
    }
  };

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#eef2ff" : "white",
      border: `2px solid ${state.isFocused ? "#a5b4fc" : "#c7d2fe"}`,
      borderRadius: "0.75rem",
      padding: "0.25rem 0.75rem",
      fontSize: "0.875rem",
      fontWeight: "500",
      minHeight: "3rem",
      boxShadow: state.isFocused
        ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
        : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      color: "#4f46e5",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        borderColor: "#6366f1",
        backgroundColor: "#eef2ff",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "0.875rem",
      fontWeight: "400",
      backgroundColor: state.isSelected
        ? "#4f46e5"
        : state.isFocused
        ? "#eef2ff"
        : "white",
      color: state.isSelected ? "white" : "#1f2937",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: state.isSelected ? "#4f46e5" : "#eef2ff",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#4f46e5",
      fontSize: "0.875rem",
      fontWeight: "500",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#4f46e5",
      fontSize: "0.875rem",
      fontWeight: "500",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "#6366f1" : "#4f46e5",
      "&:hover": {
        color: "#6366f1",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  return (
    <div className="w-full md:w-40">
      <Select
        instanceId="currency-selector"
        options={currencyOptions}
        onChange={handleCurrencySelect}
        defaultValue={currencyOptions.find((option) => option.value === "INR")}
        placeholder="Select Currency"
        isSearchable
        className="react-select-container"
        classNamePrefix="react-select"
        styles={selectStyles}
      />
    </div>
  );
};
