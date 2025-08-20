"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Header from "./components/layout/Header";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to <span className="text-indigo-600">Finyomatic</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your personal financial management solution. Track expenses, manage
            budgets, and achieve your financial goals.
          </p>

          <div className="mt-8 flex justify-center">
            {status === "loading" ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            ) : session ? (
              <div className="space-x-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Go to Dashboard
                </Link>
                <p className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-700">
                  Welcome back, {session.user.name}!
                </p>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
