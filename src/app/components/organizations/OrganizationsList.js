import { useEffect, useState, useCallback, useRef } from "react";
import {
  PencilLine,
  Trash,
  User,
  MapPin,
  Mail,
  Phone,
  Search,
} from "lucide-react";
import { AddEditOrganizations } from "./AddEditOrganizations";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer, Bounce } from "react-toastify";
import { useRouter } from "next/navigation";

export const OrganizationsList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const fetchUsers = useCallback(
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

        const response = await fetch(`/api/organizations?${queryParams}`);
        const data = await response.json();
        if (response.ok && data) {
          setUsers(data.data);
          setTotalUsers(data.total);
        } else {
          toast.error(data.error || "Failed to fetch organizations");
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
        toast.error("Failed to fetch organizations");
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  const notify = () => {
    toast.success("Organization deleted successfully!", {
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

  // Fetch users when debouncedSearchTerm or page changes
  useEffect(() => {
    fetchUsers(debouncedSearchTerm, page);
  }, [debouncedSearchTerm, page, fetchUsers]);

  // Reset to page 1 when search term changes (but not on initial load)
  useEffect(() => {
    if (searchTerm !== "" && page !== 1) {
      setPage(1);
    }
  }, [debouncedSearchTerm]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this organization?")) return;

    try {
      const res = await fetch("/api/organizations", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchUsers();
        notify();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to delete the organization");
      }
    } catch (error) {
      console.error("Error deleting organization:", error);
      toast.error("Failed to delete the organization");
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
        // When adding a new user, we need to redirect to the page where it will appear
        // First, get the updated total count
        try {
          const queryParams = new URLSearchParams({
            page: "1",
            limit: "1", // Just get the count
          });

          if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
            queryParams.append("search", debouncedSearchTerm.trim());
          }

          const response = await fetch(`/api/organizations?${queryParams}`);
          const data = await response.json();

          if (response.ok && data) {
            const newTotalUsers = data.total;
            const lastPage = Math.ceil(newTotalUsers / limit);

            // Navigate to the last page where the new user will appear
            setPage(lastPage);

            // Then fetch the users for that page
            await fetchUsers(debouncedSearchTerm, lastPage);
          } else {
            // Fallback: just refresh current view
            fetchUsers();
          }
        } catch (error) {
          console.error("Error calculating page for new user:", error);
          // Fallback: just refresh current view
          fetchUsers();
        }
      } else {
        // For edit operations, just refresh the current page
        fetchUsers();
      }
    },
    [fetchUsers, debouncedSearchTerm, limit]
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
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
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600">Manage your user accounts</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search organizations..."
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
          <AddEditOrganizations
            mode="add"
            onSuccess={() => onAddEditSuccess("add")}
          />
        </div>
      </div>

      {/* User List */}
      {users.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {debouncedSearchTerm
              ? `No users found for "${debouncedSearchTerm}"`
              : "No users found"}
          </h3>
          <p className="text-gray-500 mb-4">
            {debouncedSearchTerm
              ? "Try adjusting your search terms or clear the search to see all users."
              : "Get started by adding your first user."}
          </p>
          {debouncedSearchTerm ? (
            <button
              onClick={clearSearch}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mr-3"
            >
              Clear Search
            </button>
          ) : null}
          <AddEditOrganizations
            mode="add"
            onSuccess={() => onAddEditSuccess("add")}
          />
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users?.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-lg font-medium text-indigo-600">
                              {user.name[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.company || "User"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {user.email && (
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {user.email}
                          </div>
                        )}
                        {user.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {user.city && user.state
                          ? `${user.city}, ${user.state}`
                          : user.city || user.state || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <AddEditOrganizations
                          mode="edit"
                          user={user}
                          onSuccess={() => onAddEditSuccess("edit")}
                        />
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => handleDelete(user.id)}
                          title="Delete User"
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
            {users?.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-lg font-medium text-indigo-600">
                          {user.name[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {user.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {user.company || "User"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {user.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-900">{user.email}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">
                      {user.city && user.state
                        ? `${user.city}, ${user.state}`
                        : user.city || user.state || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <AddEditOrganizations
                    mode="edit"
                    user={user}
                    onSuccess={() => onAddEditSuccess("edit")}
                  />
                  <button
                    onClick={() => handleDelete(user.id)}
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
          {totalUsers && limit && totalUsers > limit && (
            <div className="mt-6 flex justify-center">
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                pageCount={Math.ceil(totalUsers / limit)}
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
