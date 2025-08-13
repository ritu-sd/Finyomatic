"use client";

import { useState } from "react";
import { IBM_Plex_Sans } from "next/font/google";
import { signIn, signOut } from "next-auth/react";

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
    <header className="sticky top-0 z-50 header-bg border-b header-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 logo-bg">
              <span className="font-bold text-sm tracking-wide logo-text">
                PDFY
              </span>
            </div>

            {/* Horizontal Line */}
            <div className="w-8 h-0.5 logo-line"></div>
          </div>

          {/* Centered Desktop Navigation */}
          <nav className="hidden md:flex space-x-12 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`font-medium text-sm tracking-wider transition-colors duration-300 nav-text nav-hover ${ibmPlexSans.className}`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right Side - Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className={`font-medium text-sm tracking-wide transition-colors duration-300 px-4 py-2 btn-secondary ${ibmPlexSans.className}`}
              onClick={() => signIn("google")}
            >
              Log In
            </button>
            <button
              className={`font-medium text-sm tracking-wide px-6 py-2.5 rounded-sm transition-colors duration-300 btn-primary ${ibmPlexSans.className}`}
            >
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="focus:outline-none transition-colors duration-300 nav-text nav-hover"
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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 rounded-lg mt-2 shadow-lg border mobile-bg mobile-border">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 nav-text mobile-hover ${ibmPlexSans.className}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 pb-2 space-y-2">
                <button
                  className={`w-full font-medium text-base py-2 rounded-md transition-colors duration-200 btn-secondary mobile-hover ${ibmPlexSans.className}`}
                >
                  Log In
                </button>
                <button
                  className={`w-full font-medium text-base py-2 rounded-md transition-colors duration-200 btn-primary ${ibmPlexSans.className}`}
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
