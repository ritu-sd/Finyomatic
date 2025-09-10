"use client";

import { useSession } from "next-auth/react";
import Header from "@/src/app/components/layout/Header";

import { InvoiceForm } from "../../components/invoice/InvoiceForm";

export default function Dashboard() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="max-w-7xl mx-auto">
      <Header />
      <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-8 shadow-sm mt-4">
        <InvoiceForm />
      </div>
    </main>
  );
}
