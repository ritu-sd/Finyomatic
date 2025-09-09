import { useEffect, useState, useCallback, useRef } from "react";
import { Trash, Building, CreditCard, Search } from "lucide-react";
import { AddEditBanks } from "./AddEditBanks";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer, Bounce } from "react-toastify";

export const BanksList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalBanks, setTotalBanks] = useState(0);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const fetchBanks = useCallback(
    async (searchQuery = debouncedSearchTerm, currentPage = page) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: limit.toString(),
        });

        if (searchQuery && searchQuery.trim()) {
          queryParams.append("search", searchQuery.trim());
        }

        const response = await fetch(`/api/bank?${queryParams}`);
        const data = await response.json();
        if (response.ok && data) {
          setBanks(data.data);
          setTotalBanks(data.total);
        } else {
          toast.error(data.error || "Failed to fetch bank details");
        }
      } catch (error) {
        console.error("Error fetching bank details:", error);
        toast.error("Failed to fetch bank details");
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  const notify = () => {
    toast.success("Bank details deleted successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch banks when debouncedSearchTerm or page changes
  useEffect(() => {
    fetchBanks(debouncedSearchTerm, page);
  }, [debouncedSearchTerm, page, fetchBanks]);

  // Reset to page 1 when search term changes (but not on initial load)
  useEffect(() => {
    if (searchTerm !== "" && page !== 1) {
      setPage(1);
    }
  }, [debouncedSearchTerm]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this bank details?")) return;

    try {
      const res = await fetch("/api/bank", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchBanks();
        notify();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to delete the bank details");
      }
    } catch (error) {
      console.error("Error deleting bank details:", error);
      toast.error("Failed to delete the bank details");
    }
  };

  const handlePageClick = (event) => {
    const { selected } = event;
    setPage(selected + 1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const onAddEditSuccess = useCallback(
    async (mode) => {
      if (mode === "add" || mode === "edit") {
        // When adding a new bank details, we need to redirect to the page where it will appear
        // First, get the updated total count
        try {
          const queryParams = new URLSearchParams({
            page: "1",
            limit: "1", // Just get the count
          });

          if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
            queryParams.append("search", debouncedSearchTerm.trim());
          }

          const response = await fetch(`/api/bank?${queryParams}`);
          const data = await response.json();

          if (response.ok && data) {
            const newTotalBanks = data.total;
            const lastPage = Math.ceil(newTotalBanks / limit);

            // Navigate to the last page where the new bank details will appear
            setPage(lastPage);

            // Then fetch the banks for that page
            await fetchBanks(debouncedSearchTerm, lastPage);
          } else {
            // Fallback: just refresh current view
            fetchBanks();
          }
        } catch (error) {
          console.error("Error calculating page for new bank details:", error);
          // Fallback: just refresh current view
          fetchBanks();
        }
      } else {
        // For edit operations, just refresh the current page
        fetchBanks();
      }
    },
    [fetchBanks, debouncedSearchTerm, limit]
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <ToastContainer />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bank Details</h1>
          <p className="text-gray-600">Manage your banking information</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bank details..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg text-sm"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer">
                  ×
                </span>
              </button>
            )}
          </div>
          <AddEditBanks mode="add" onSuccess={() => onAddEditSuccess("add")} />
        </div>
      </div>

      {/* Bank Details List */}
      {banks.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <Building className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {debouncedSearchTerm
              ? `No bank details found for "${debouncedSearchTerm}"`
              : "No bank details found"}
          </h3>
          <p className="text-gray-500 mb-4">
            {debouncedSearchTerm
              ? "Try adjusting your search terms or clear the search to see all bank details."
              : "Get started by adding your first bank account."}
          </p>
          {debouncedSearchTerm ? (
            <button
              onClick={clearSearch}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mr-3"
            >
              Clear Search
            </button>
          ) : null}
          <AddEditBanks mode="add" onSuccess={() => onAddEditSuccess("add")} />
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bank Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IFSC Code
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banks?.map((bank) => (
                  <tr key={bank.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Building className="h-5 w-5 text-indigo-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {bank.bankName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {bank.accountName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                        {bank.accountNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {bank.ifscCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <AddEditBanks
                          mode="edit"
                          bank={bank}
                          onSuccess={() => onAddEditSuccess("edit")}
                        />
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => handleDelete(bank.id)}
                          title="Delete Bank Details"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {banks?.map((bank) => (
              <div
                key={bank.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Building className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {bank.bankName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {bank.accountName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-900">{bank.accountNumber}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 mr-2">IFSC:</span>
                    <span className="text-gray-900">{bank.ifscCode}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <AddEditBanks
                    mode="edit"
                    bank={bank}
                    onSuccess={() => onAddEditSuccess("edit")}
                  />
                  <button
                    onClick={() => handleDelete(bank.id)}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalBanks && limit && totalBanks > limit && (
            <div className="mt-6 flex justify-center">
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                pageCount={Math.ceil(totalBanks / limit)}
                previousLabel="<"
                renderOnZeroPageCount={null}
                forcePage={page - 1} // Add forcePage to fix active link issue
                className="join"
                pageClassName="join-item"
                pageLinkClassName="btn btn-sm"
                activeLinkClassName="btn-primary"
                previousClassName="join-item"
                previousLinkClassName="btn btn-sm"
                nextClassName="join-item"
                nextLinkClassName="btn btn-sm"
                disabledLinkClassName="btn-disabled"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
