"use client";
import React, { useRef, useState } from "react";
import {
  ChevronDown,
  Landmark,
  CircleUserRound,
  Scroll,
  Users,
} from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useClickAway } from "react-use";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const DropDownMenu = () => {
  const ref = useRef(null);
  const session = useSession();
  const pathname = usePathname();
  const [imageLoadError, setImageLoadError] = useState(false);

  useClickAway(ref, () => {
    ref.current?.removeAttribute("open");
  });

  const closeDropdown = () => {
    ref.current?.removeAttribute("open");
  };

  const onClickSignout = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await signOut({ callbackUrl: "/" });
  };

  const getUserInitials = () => {
    const name = session?.data?.user?.name;
    if (!name) return "U";
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return nameParts[0][0] + nameParts[1][0];
    }
    return nameParts[0][0];
  };

  const isActiveRoute = (route) => {
    return pathname === route;
  };

  const getMenuItemClasses = (route) => {
    const baseClasses =
      "flex items-center gap-2 py-2 px-3 min-h-[40px] rounded-lg transition-all duration-200 group";
    const activeClasses = "bg-black text-white font-semibold shadow-md";
    const inactiveClasses =
      "hover:bg-gray-100 active:bg-gray-200 text-gray-700 hover:text-gray-800 border border-transparent hover:border-gray-200";

    return isActiveRoute(route)
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  };

  if (session?.status === "loading") {
    return (
      <div className="flex items-center justify-center gap-3 bg-gray-100 border border-gray-200 rounded-2xl py-3 px-4 min-h-[48px] shadow-lg">
        <div className="loading loading-spinner loading-sm text-gray-600"></div>
        <span className="text-sm sm:text-base text-gray-700 font-medium">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <details className="dropdown dropdown-bottom dropdown-end" ref={ref}>
      <summary
        role="button"
        className="flex items-center justify-center gap-2 sm:gap-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 rounded-2xl py-3 px-3 sm:px-4 cursor-pointer select-none min-h-[40px] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
      >
        <div className="flex-shrink-0">
          {session.data.user && session.data.user.image && !imageLoadError ? (
            <div className="avatar">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full ring-2 ring-gray-200 ring-offset-2">
                <img
                  src={session.data.user.image}
                  alt="User Avatar"
                  onError={() => setImageLoadError(true)}
                  onLoad={() => setImageLoadError(false)}
                  className="object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="bg-black text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-gray-200 ring-offset-2">
              <span className="text-xs sm:text-sm font-semibold">
                {getUserInitials()}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-1 sm:gap-2 items-center min-w-0">
          <span className="font-semibold text-sm sm:text-base text-gray-700 truncate max-w-[120px] sm:max-w-none">
            {session.data.user.name}
          </span>
          <ChevronDown className="w-4 h-4 flex-shrink-0 text-gray-500 transition-transform duration-200 group-hover:rotate-180" />
        </div>
      </summary>
      <ul className="menu dropdown-content bg-white rounded-xl z-[60] w-56 sm:w-64 p-2 shadow-2xl border border-gray-200 mt-3 left-1/2 transform -translate-x-1/2 relative">
        {/* User info header for mobile */}
        <li className="block sm:hidden mb-2">
          <div className="flex items-center gap-2 py-2 px-3 bg-gray-100 rounded-lg pointer-events-none border border-gray-200">
            <div className="flex-shrink-0">
              {session.data.user &&
              session.data.user.image &&
              !imageLoadError ? (
                <div className="avatar">
                  <div className="w-8 h-8 rounded-full ring-1 ring-gray-200">
                    <img
                      src={session.data.user.image}
                      alt="User Avatar"
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center ring-1 ring-gray-200">
                  <span className="text-xs font-semibold">
                    {getUserInitials()}
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm text-gray-800 truncate">
                {session.data.user.name}
              </div>
              <div className="text-xs text-gray-600 truncate">
                {session.data.user.email}
              </div>
            </div>
          </div>
        </li>

        <li className="mb-1">
          <Link
            href="/organizations"
            className={getMenuItemClasses("/organizations")}
            onClick={closeDropdown}
          >
            <CircleUserRound className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium text-sm">My Organizations</span>
          </Link>
        </li>
        <li className="mb-1">
          <Link
            href="/bank-details"
            className={getMenuItemClasses("/bank-details")}
            onClick={closeDropdown}
          >
            <Landmark className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium text-sm">Bank Details</span>
          </Link>
        </li>
        <li className="mb-1">
          <Link
            href="/clients"
            className={getMenuItemClasses("/clients")}
            onClick={closeDropdown}
          >
            <Users className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium text-sm">Clients</span>
          </Link>
        </li>
        <li className="mb-2">
          <Link
            href="/invoices"
            className={getMenuItemClasses("/invoices")}
            onClick={closeDropdown}
          >
            <Scroll className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium text-sm">Invoices</span>
          </Link>
        </li>

        <li>
          <button
            className="btn bg-black hover:bg-gray-800 border-none text-white w-full min-h-[36px] text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            onClick={onClickSignout}
          >
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </details>
  );
};
