"use client";

import { useState } from "react";
import { IBM_Plex_Sans } from "next/font/google";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Modal from "react-modal";
import { useSession } from "next-auth/react";
import { DropDownMenu } from "./DropDownMenu";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["500"],
});

// Set modal app element for accessibility
if (typeof window !== "undefined") {
  Modal.setAppElement(document.body);
}

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openAuthModal = (mode) => {
    setIsLoginMode(mode);
    setIsAuthModalOpen(true);
    setErrors({});
    setAuthError("");
    setSuccessMessage("");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setErrors({});
    setAuthError("");
    setSuccessMessage("");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (isLoginMode) {
      // Login validation
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
    } else {
      // Signup validation
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isLoginMode) {
        // Handle login
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setAuthError("Invalid email or password");
        } else {
          setSuccessMessage("Login successful! Redirecting...");
          setTimeout(() => {
            closeAuthModal();
            router.push("/");
          }, 1500);
        }
      } else {
        // Handle signup
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.details && Array.isArray(data.details)) {
            // Handle validation errors
            const fieldErrors = {};
            data.details.forEach((error) => {
              fieldErrors[error.field] = error.message;
            });
            setErrors(fieldErrors);
            setAuthError("Please fix the errors below.");
          } else {
            setAuthError(
              data.error || "Registration failed. Please try again."
            );
          }
        } else {
          setSuccessMessage(
            "Account created successfully! You can now sign in."
          );
          setTimeout(() => {
            setIsLoginMode(true);
            setFormData({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            });
            setErrors({});
            setAuthError("");
          }, 2000);
        }
      }
    } catch (error) {
      setAuthError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google");
    closeAuthModal();
  };

  const navItems = [
    { name: "Product", href: "#creative" },
    { name: "Pricing", href: "#website" },
    { name: "Help", href: "#designs" },
  ];

  const session = useSession();

  return (
    <>
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
              {/* <button
                className={`font-medium text-sm tracking-wide transition-colors duration-300 px-4 py-2 btn-secondary ${ibmPlexSans.className}`}
                onClick={() => openAuthModal(true)}
              >
                Log In
              </button> */}
              {!session?.data?.user && (
                <button
                  className={`font-medium text-sm tracking-wide px-4 py-2.5 rounded-sm transition-colors duration-300 btn-primary ${ibmPlexSans.className}`}
                  onClick={() => openAuthModal(false)}
                >
                  Log In / Sign Up
                </button>
              )}

              {session?.data?.user && (
                <div className="flex items-center gap-3">
                  {/* <span className="text-sm font-medium text-gray-700">
                    {session.data.user.name || session.data.user.email}
                  </span> */}
                  <DropDownMenu />
                </div>
              )}
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
                  {/* <button
                    className={`w-full font-medium text-base py-2 rounded-md transition-colors duration-200 btn-secondary mobile-hover ${ibmPlexSans.className}`}
                    onClick={() => openAuthModal(true)}
                  >
                    Log In
                  </button> */}
                  {!session?.data?.user && (
                    <button
                      className={`w-full font-medium text-base py-2 rounded-md transition-colors duration-200 btn-primary ${ibmPlexSans.className}`}
                      onClick={() => openAuthModal(false)}
                    >
                      Log in/Sign up
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Authentication Modal */}
      <Modal
        isOpen={isAuthModalOpen}
        onRequestClose={closeAuthModal}
        className="modal-content"
        overlayClassName="modal-overlay"
        contentLabel="Authentication Modal"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 relative">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isLoginMode ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {isLoginMode
                ? "Sign in to your account"
                : "Sign up for a new account"}
            </p>
          </div>

          {/* Error/Success Messages */}
          {authError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-6">
              {authError}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-md mb-6">
              {successMessage}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center space-x-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 mb-6 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium">Continue with Google</span>
          </button>

          {/* Toggle Mode */}

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Header;
