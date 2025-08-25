"use client";

import Header from "../components/layout/Header";
import { Hero } from "../components/layout/Hero";
import Service from "../components/layout/Service";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Service />
    </div>
  );
}
