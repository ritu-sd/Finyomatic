"use client";
import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import getSymbolFromCurrency from "currency-symbol-map";
import { CurrencySelector } from "./CurrencySelector";
import { TaxModal } from "./TaxModal";

export const Items = ({
  items,
  handleChange,
  removeItem,
  addItem,
  discount,
  discountType,
  discountHidden,
  handleDiscountChange,
  handleDiscountTypeChange,
  handleDiscountBtn,
  totals,
  currency,
  handleCurrencyChange,
  // New props for tax configuration
  selectedTaxType,
  gstType,
  handleItemTaxChange,
  handleTaxConfigChange,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effect to handle tax configuration changes
  useEffect(() => {
    console.log("Tax configuration changed:", { selectedTaxType, gstType });
  }, [selectedTaxType, gstType]);

  const discountTypeOptions = [
    { value: "percentage", label: "%" },
    { value: "fixed", label: getSymbolFromCurrency(currency) },
  ];

  const onCurrencyChange = (e) => {
    handleCurrencyChange(e);
  };

  // Calculate dynamic grid columns based on tax type
  const getGridConfig = () => {
    const baseColumns = {
      description: 3,
      quantity: 1,
      rate: 1,
      amount: 1,
      actions: 1,
    };

    if (selectedTaxType === "tax") {
      return {
        ...baseColumns,
        taxRate: 1,
        taxAmount: 2,
        totalAmount: 2,
        totalCols: 12,
        gridClass: "grid-cols-12",
        descriptionClass: "col-span-3",
        quantityClass: "col-span-1",
        rateClass: "col-span-1",
        amountClass: "col-span-1",
        taxRateClass: "col-span-1",
        taxAmountClass: "col-span-2",
        totalAmountClass: "col-span-2",
        actionsClass: "col-span-1",
      };
    } else if (selectedTaxType === "gst") {
      if (gstType === "igst") {
        return {
          ...baseColumns,
          gstRate: 1,
          igst: 2,
          totalAmount: 2,
          totalCols: 12,
          gridClass: "grid-cols-12",
          descriptionClass: "col-span-3",
          quantityClass: "col-span-1",
          rateClass: "col-span-1",
          amountClass: "col-span-1",
          gstRateClass: "col-span-1",
          igstClass: "col-span-2",
          totalAmountClass: "col-span-2",
          actionsClass: "col-span-1",
        };
      } else if (gstType === "cgst_sgst") {
        return {
          ...baseColumns,
          gstRate: 1,
          cgst: 1,
          sgst: 1,
          totalAmount: 2,
          totalCols: 12,
          gridClass: "grid-cols-12",
          descriptionClass: "col-span-3",
          quantityClass: "col-span-1",
          rateClass: "col-span-1",
          amountClass: "col-span-1",
          gstRateClass: "col-span-1",
          cgstClass: "col-span-1",
          sgstClass: "col-span-1",
          totalAmountClass: "col-span-2",
          actionsClass: "col-span-1",
        };
      }
    }

    return {
      ...baseColumns,
      totalCols: 7,
      gridClass: "grid-cols-7",
      descriptionClass: "col-span-3",
      quantityClass: "col-span-1",
      rateClass: "col-span-1",
      amountClass: "col-span-1",
      actionsClass: "col-span-1",
    };
  };

  const gridConfig = useMemo(() => getGridConfig(), [selectedTaxType, gstType]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleOpenModal = () => {
    setModalIsOpen(true);
  };
  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="mt-5 w-full">
      {/* Items Table Header - Hidden on Mobile */}

      <div
        className={`hidden sm:grid bg-gradient-to-r from-[#0a3a5f] to-[#136db2] ${gridConfig.gridClass} px-4 sm:px-6 py-4 rounded-t-xl text-white font-medium shadow-md`}
      >
        <p
          className={`${gridConfig.descriptionClass} text-xs sm:text-sm font-semibold tracking-wide`}
        >
          ITEM DESCRIPTION
        </p>
        <p
          className={`${gridConfig.quantityClass} text-center text-xs sm:text-sm font-semibold tracking-wide`}
        >
          QUANTITY
        </p>
        <p
          className={`${gridConfig.rateClass} text-center text-xs sm:text-sm font-semibold tracking-wide`}
        >
          RATE
        </p>
        <p
          className={`${gridConfig.amountClass} text-center text-xs sm:text-sm font-semibold tracking-wide`}
        >
          AMOUNT
        </p>

        {/* Tax columns */}
        {selectedTaxType === "tax" && (
          <>
            <p
              className={`${gridConfig.taxRateClass} text-center text-xs sm:text-sm font-semibold tracking-wide`}
            >
              TAX RATE (%)
            </p>
            <p
              className={`${gridConfig.taxAmountClass} text-center text-xs sm:text-sm font-semibold tracking-wide`}
            >
              TAX AMOUNT
            </p>
            <p
              className={`${gridConfig.totalAmountClass} text-center text-xs sm:text-sm font-semibold tracking-wide`}
            >
              TOTAL AMOUNT
            </p>
          </>
        )}

        {/* GST columns */}
        {selectedTaxType === "gst" && (
          <>
            <p
              className={`${gridConfig.gstRateClass} text-center text-xs sm:text-sm font-semibold tracking-wide`}
            >
              GST RATE (%)
            </p>
            {gstType === "igst" && (
              <p
                className={`${gridConfig.igstClass} text-center text-xs sm:text-sm font-semibold tracking-wide`}
              >
                IGST
              </p>
            )}
            {gstType === "cgst_sgst" && (
              <>
                <p
                  className={`${gridConfig.cgstClass} text-center text-xs sm:text-sm font-semibold tracking-wide`}
                >
                  CGST
                </p>
                <p
                  className={`${gridConfig.sgstClass} text-center text-xs sm:text-sm font-semibold tracking-wide`}
                >
                  SGST
                </p>
              </>
            )}
            <p
              className={`${gridConfig.totalAmountClass} text-center text-xs sm:text-sm font-semibold tracking-wide`}
            >
              TOTAL AMOUNT
            </p>
          </>
        )}

        <p className={`${gridConfig.actionsClass}`}></p>
      </div>

      {/* Mobile Table Header */}
      <div className="sm:hidden bg-gradient-to-r from-[#0a3a5f] to-[#136db2] px-4 py-3 rounded-t-xl text-white font-medium shadow-md">
        <p className="text-sm font-semibold tracking-wide text-center">
          ITEM DETAILS
        </p>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-b-xl shadow-lg">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`sm:grid ${
              gridConfig.gridClass
            } px-4 sm:px-6 py-4 items-center hover:bg-[#379cea]/5 transition-colors duration-150 ${
              index !== items.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            {/* Mobile Layout */}
            <div className="sm:hidden space-y-3">
              <div className="w-full">
                <label className="block text-xs font-medium text-[#0e5389] mb-1">
                  ITEM DESCRIPTION
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleChange(item.id, "name", e.target.value)
                  }
                  placeholder="Item description"
                  className="w-full focus:outline-none focus:ring-2 focus:ring-[#136db2] px-3 py-2 rounded-lg border border-gray-200 text-[#0a3a5f]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#0e5389] mb-1">
                    QUANTITY
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleChange(item.id, "quantity", e.target.value)
                    }
                    placeholder="0"
                    className="w-full text-center focus:outline-none focus:ring-2 focus:ring-[#136db2] px-3 py-2 rounded-lg border border-gray-200 text-[#0a3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#0e5389] mb-1">
                    RATE
                  </label>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      handleChange(item.id, "rate", e.target.value)
                    }
                    placeholder="0.00"
                    className="w-full text-center focus:outline-none focus:ring-2 focus:ring-[#136db2] px-3 py-2 rounded-lg border border-gray-200 text-[#0a3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#0e5389] mb-1">
                    AMOUNT
                  </label>
                  <div className="w-full text-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[#0a3a5f] font-medium">
                    {getSymbolFromCurrency(currency)}
                    {item.amount || "0.00"}
                  </div>
                </div>
              </div>

              {/* Mobile Tax Section */}
              {selectedTaxType === "tax" && (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-[#0e5389] mb-1">
                      TAX RATE (%)
                    </label>
                    <input
                      type="number"
                      value={item.taxRate || ""}
                      onChange={(e) =>
                        handleItemTaxChange &&
                        handleItemTaxChange(item.id, "taxRate", e.target.value)
                      }
                      placeholder="0"
                      className="w-full text-center focus:outline-none focus:ring-2 focus:ring-[#136db2] px-3 py-2 rounded-lg border border-gray-200 text-[#0a3a5f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#0e5389] mb-1">
                      TAX AMOUNT
                    </label>
                    <div className="w-full text-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[#0a3a5f] font-medium">
                      {getSymbolFromCurrency(currency)}
                      {(
                        ((parseFloat(item.amount) || 0) *
                          (parseFloat(item.taxRate) || 0)) /
                        100
                      ).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#0e5389] mb-1">
                      TOTAL AMOUNT
                    </label>
                    <div className="w-full text-center bg-[#379cea]/10 border border-[#379cea]/20 px-3 py-2 rounded-lg text-[#0a3a5f] font-bold">
                      {getSymbolFromCurrency(currency)}
                      {(
                        (parseFloat(item.amount) || 0) +
                        ((parseFloat(item.amount) || 0) *
                          (parseFloat(item.taxRate) || 0)) /
                          100
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile GST Section */}
              {selectedTaxType === "gst" && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-[#0e5389] mb-1">
                        GST RATE (%)
                      </label>
                      <input
                        type="number"
                        value={item.gstRate || ""}
                        onChange={(e) =>
                          handleItemTaxChange &&
                          handleItemTaxChange(
                            item.id,
                            "gstRate",
                            e.target.value
                          )
                        }
                        placeholder="0"
                        className="w-full text-center focus:outline-none focus:ring-2 focus:ring-[#136db2] px-3 py-2 rounded-lg border border-gray-200 text-[#0a3a5f]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#0e5389] mb-1">
                        TOTAL AMOUNT
                      </label>
                      <div className="w-full text-center bg-[#379cea]/10 border border-[#379cea]/20 px-3 py-2 rounded-lg text-[#0a3a5f] font-bold">
                        {getSymbolFromCurrency(currency)}
                        {(
                          (parseFloat(item.amount) || 0) +
                          ((parseFloat(item.amount) || 0) *
                            (parseFloat(item.gstRate) || 0)) /
                            100
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* GST Breakdown */}
                  {gstType === "igst" && (
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-[#0e5389] mb-1">
                          IGST
                        </label>
                        <div className="w-full text-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[#0a3a5f] font-medium">
                          {getSymbolFromCurrency(currency)}
                          {(
                            ((parseFloat(item.amount) || 0) *
                              (parseFloat(item.gstRate) || 0)) /
                            100
                          ).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}

                  {gstType === "cgst_sgst" && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-[#0e5389] mb-1">
                          CGST
                        </label>
                        <div className="w-full text-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[#0a3a5f] font-medium">
                          {getSymbolFromCurrency(currency)}
                          {(
                            ((parseFloat(item.amount) || 0) *
                              (parseFloat(item.gstRate) || 0)) /
                            200
                          ).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#0e5389] mb-1">
                          SGST
                        </label>
                        <div className="w-full text-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[#0a3a5f] font-medium">
                          {getSymbolFromCurrency(currency)}
                          {(
                            ((parseFloat(item.amount) || 0) *
                              (parseFloat(item.gstRate) || 0)) /
                            200
                          ).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                  aria-label="Remove item"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div
              className={`hidden sm:block ${gridConfig.descriptionClass} pr-2`}
            >
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleChange(item.id, "name", e.target.value)}
                placeholder="Item description"
                className="w-full focus:outline-none focus:ring-2 focus:ring-[#136db2] px-3 py-2 rounded-lg border border-gray-200 text-[#0a3a5f]"
              />
            </div>
            <div className={`hidden sm:block ${gridConfig.quantityClass} px-1`}>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleChange(item.id, "quantity", e.target.value)
                }
                placeholder="0"
                className="w-full text-center focus:outline-none focus:ring-2 focus:ring-[#136db2] px-3 py-2 rounded-lg border border-gray-200 text-[#0a3a5f]"
              />
            </div>
            <div className={`hidden sm:block ${gridConfig.rateClass} px-1`}>
              <input
                type="number"
                value={item.rate}
                onChange={(e) => handleChange(item.id, "rate", e.target.value)}
                placeholder="0.00"
                className="w-full text-center focus:outline-none focus:ring-2 focus:ring-[#136db2] px-3 py-2 rounded-lg border border-gray-200 text-[#0a3a5f]"
              />
            </div>
            <div className={`hidden sm:block ${gridConfig.amountClass} px-1`}>
              <div className="w-full text-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[#0a3a5f] font-medium">
                {getSymbolFromCurrency(currency)}
                {item.amount || "0.00"}
              </div>
            </div>

            {/* Tax columns */}
            {selectedTaxType === "tax" && (
              <>
                <div
                  className={`hidden sm:block ${gridConfig.taxRateClass} px-1`}
                >
                  <input
                    type="number"
                    value={item.taxRate || ""}
                    onChange={(e) =>
                      handleItemTaxChange &&
                      handleItemTaxChange(item.id, "taxRate", e.target.value)
                    }
                    placeholder="0"
                    className="w-full text-center focus:outline-none focus:ring-2 focus:ring-[#136db2] px-3 py-2 rounded-lg border border-gray-200 text-[#0a3a5f]"
                  />
                </div>
                <div
                  className={`hidden sm:block ${gridConfig.taxAmountClass} px-1`}
                >
                  <div className="w-full text-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[#0a3a5f] font-medium">
                    {getSymbolFromCurrency(currency)}
                    {(
                      ((parseFloat(item.amount) || 0) *
                        (parseFloat(item.taxRate) || 0)) /
                      100
                    ).toFixed(2)}
                  </div>
                </div>
                <div
                  className={`hidden sm:block ${gridConfig.totalAmountClass} px-1`}
                >
                  <div className="w-full text-center bg-[#379cea]/10 border border-[#379cea]/20 px-3 py-2 rounded-lg text-[#0a3a5f] font-bold">
                    {getSymbolFromCurrency(currency)}
                    {(
                      (parseFloat(item.amount) || 0) +
                      ((parseFloat(item.amount) || 0) *
                        (parseFloat(item.taxRate) || 0)) /
                        100
                    ).toFixed(2)}
                  </div>
                </div>
              </>
            )}

            {/* GST columns */}
            {selectedTaxType === "gst" && (
              <>
                <div
                  className={`hidden sm:block ${gridConfig.gstRateClass} px-1`}
                >
                  <input
                    type="number"
                    value={item.gstRate || ""}
                    onChange={(e) =>
                      handleItemTaxChange &&
                      handleItemTaxChange(item.id, "gstRate", e.target.value)
                    }
                    placeholder="0"
                    className="w-full text-center focus:outline-none focus:ring-2 focus:ring-[#136db2] px-3 py-2 rounded-lg border border-gray-200 text-[#0a3a5f]"
                  />
                </div>
                {gstType === "igst" && (
                  <div
                    className={`hidden sm:block ${gridConfig.igstClass} px-1`}
                  >
                    <div className="w-full text-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[#0a3a5f] font-medium">
                      {getSymbolFromCurrency(currency)}
                      {(
                        ((parseFloat(item.amount) || 0) *
                          (parseFloat(item.gstRate) || 0)) /
                        100
                      ).toFixed(2)}
                    </div>
                  </div>
                )}
                {gstType === "cgst_sgst" && (
                  <>
                    <div
                      className={`hidden sm:block ${gridConfig.cgstClass} px-1`}
                    >
                      <div className="w-full text-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[#0a3a5f] font-medium">
                        {getSymbolFromCurrency(currency)}
                        {(
                          ((parseFloat(item.amount) || 0) *
                            (parseFloat(item.gstRate) || 0)) /
                          200
                        ).toFixed(2)}
                      </div>
                    </div>
                    <div
                      className={`hidden sm:block ${gridConfig.sgstClass} px-1`}
                    >
                      <div className="w-full text-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[#0a3a5f] font-medium">
                        {getSymbolFromCurrency(currency)}
                        {(
                          ((parseFloat(item.amount) || 0) *
                            (parseFloat(item.gstRate) || 0)) /
                          200
                        ).toFixed(2)}
                      </div>
                    </div>
                  </>
                )}
                <div
                  className={`hidden sm:block ${gridConfig.totalAmountClass} px-1`}
                >
                  <div className="w-full text-center bg-[#379cea]/10 border border-[#379cea]/20 px-3 py-2 rounded-lg text-[#0a3a5f] font-bold">
                    {getSymbolFromCurrency(currency)}
                    {(
                      (parseFloat(item.amount) || 0) +
                      ((parseFloat(item.amount) || 0) *
                        (parseFloat(item.gstRate) || 0)) /
                        100
                    ).toFixed(2)}
                  </div>
                </div>
              </>
            )}

            <div
              className={`hidden sm:flex ${gridConfig.actionsClass} justify-center`}
            >
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                aria-label="Remove item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Button and Totals */}
      <div className="mt-6 sm:mt-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-6 sm:gap-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full md:w-auto">
          <button
            onClick={addItem}
            className="flex items-center justify-center text-[#0a3a5f] hover:text-[#0e5389] px-4 sm:px-5 py-2 rounded-xl border-2 border-[#379cea]/20 hover:border-[#379cea]/40 hover:bg-[#379cea]/10 transition-all duration-200 shadow-sm w-full font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Add New Item
          </button>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5 w-full md:w-[340px]">
          {/* Discount Section */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleDiscountBtn}
              className={`flex items-center justify-between w-full px-4 sm:px-5 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-200
                ${
                  discountHidden
                    ? "bg-[#379cea]/10 text-[#0a3a5f] border-[#379cea]/30 hover:bg-[#379cea]/20"
                    : "bg-white text-[#0e5389] border-[#379cea]/20 hover:bg-[#379cea]/10"
                }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Discount
              </div>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  discountHidden ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {discountHidden && (
              <div className="flex gap-3 items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  type="number"
                  placeholder={`Enter discount ${
                    discountType === "percentage" ? "percentage" : "amount"
                  }`}
                  className="flex-1 bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#136db2] focus:border-[#136db2] transition-all"
                  min="0"
                  max={discountType === "percentage" ? "100" : undefined}
                  value={discount || ""}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                />
                {isClient && (
                  <Select
                    instanceId="discount-type-select"
                    options={discountTypeOptions}
                    value={discountTypeOptions.find(
                      (option) => option.value === discountType
                    )}
                    onChange={(selectedOption) =>
                      handleDiscountTypeChange(
                        selectedOption?.value || "percentage"
                      )
                    }
                    className="shrink-0"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        minHeight: "2.5rem",
                        borderColor: "#e5e7eb",
                        fontSize: "0.875rem",
                        "&:hover": {
                          borderColor: "#d1d5db",
                        },
                      }),
                      valueContainer: (provided) => ({
                        ...provided,
                        padding: "0 8px",
                      }),
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Totals Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-5 rounded-xl shadow-md border border-gray-200 w-full">
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between text-[#0e5389]">
                <span>Subtotal:</span>
                <span className="font-medium">
                  {getSymbolFromCurrency(currency)}
                  {totals.subtotal.toFixed(2)}
                </span>
              </div>

              {discountHidden && discount > 0 && (
                <div className="flex justify-between text-[#0e5389]">
                  <span>
                    Discount
                    {discountType === "percentage" ? ` (${discount}%)` : ""}:
                  </span>
                  <span className="font-medium text-red-600">
                    - {getSymbolFromCurrency(currency)}
                    {totals.discountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-[#0a3a5f] font-semibold text-lg pt-3 mt-1 border-t border-gray-200">
                <span>Total:</span>
                <span className="text-[#0a3a5f]">
                  {getSymbolFromCurrency(currency)}
                  {totals.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
