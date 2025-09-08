"use client";

import { useSession } from "next-auth/react";
import Header from "@/src/app/components/layout/Header";
import { InvoiceHeader } from "@/src/app/components/invoice/InvoiceHeader";
import { OrganizationForm } from "@/src/app/components/invoice/OrganizationForm";
import { ClientForm } from "@/src/app/components/invoice/ClientForm";

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
      <InvoiceHeader />
      <div className="flex flex-row items-center justify-center gap-x-8 mt-4">
        <OrganizationForm />
        <ClientForm />
      </div>
    </main>
  );
}
