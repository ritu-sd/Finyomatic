"use client";

import { useState } from "react";
import { IBM_Plex_Sans } from "next/font/google";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["500"],
});

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { name: "Product", href: "#creative" },
    { name: "Pricing", href: "#website" },
    { name: "Help", href: "#designs" },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm tracking-wide">
                PDFY
              </span>
            </div>

            {/* Horizontal Line */}
            <div className="w-8 h-0.5 bg-black"></div>
          </div>

          {/* Centered Desktop Navigation */}
          <nav className="hidden md:flex space-x-12 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-black font-medium text-sm tracking-wider hover:text-gray-600 transition-colors duration-300 ${ibmPlexSans.className}`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right Side - Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className={`text-black font-medium text-sm tracking-wide hover:text-gray-600 transition-colors duration-300 px-4 py-2 ${ibmPlexSans.className}`}
            >
              Log In
            </button>
            <button
              className={`bg-black text-white font-medium text-sm tracking-wide px-6 py-2.5 rounded-sm hover:bg-gray-800 transition-colors duration-300 ${ibmPlexSans.className}`}
            >
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-black hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white rounded-lg mt-2 shadow-lg border border-gray-100">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-black hover:text-gray-600 block px-3 py-2 text-base font-medium hover:bg-gray-50 rounded-md transition-colors duration-200 ${ibmPlexSans.className}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 pb-2 space-y-2">
                <button
                  className={`w-full text-black font-medium text-base py-2 hover:bg-gray-50 rounded-md transition-colors duration-200 ${ibmPlexSans.className}`}
                >
                  Log In
                </button>
                <button
                  className={`w-full bg-black text-white font-medium text-base py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 ${ibmPlexSans.className}`}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
