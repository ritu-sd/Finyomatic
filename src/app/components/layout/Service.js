"use client";

import Image from "next/image";
import { useRef } from "react";
import Link from "next/link";

const services = [
  {
    title: "Invoice Generator",
    description:
      "Create professional invoices instantly with our easy-to-use invoice generator. Perfect for businesses of all sizes.",
    image: "/invoice-design-1.png",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        />
      </svg>
    ),
    isPopular: true,
    btn: "Create Free Invoice",
    link: "/free-invoice-generator",
  },
  {
    title: "Quotation Generator",
    description:
      "Generate detailed quotations quickly and efficiently. Streamline your sales process with professional quotes.",
    image: "/invoice-design-1.png",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
    btn: "Create Free Quotation",
    link: "/free-quotation-generator",
  },
  {
    title: "Delivery Challan Generator",
    description:
      "Create accurate delivery challans for your shipments. Keep track of your deliveries with ease.",
    image: "/invoice-design-1.png",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
        />
      </svg>
    ),
    btn: "Create Free Delivery Challan",
    link: "/free-delivery-challan-generator",
  },
  {
    title: "Proforma Invoice Generator",
    description:
      "Generate proforma invoices for your international trade. Perfect for customs and pre-payment scenarios.",
    image: "/invoice-design-1.png",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
        />
      </svg>
    ),
    btn: "Create Free Proforma Invoice",
    link: "/free-proforma-invoice-generator",
  },
  {
    title: "Purchase Order Generator",
    description:
      "Create detailed purchase orders efficiently. Streamline your procurement process with professional POs.",
    image: "/invoice-design-1.png",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
    ),
    btn: "Create Free Purchase Order",
    link: "/free-purchase-order-generator",
  },
  {
    title: "GST Invoice Generator",
    description:
      "Generate GST-compliant invoices easily. Stay compliant with Indian tax regulations effortlessly.",
    image: "/invoice-design-1.png",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    ),
    isPopular: true,
    btn: "Create Free GST Invoice",
    link: "/free-gst-invoice-generator",
  },
];

export default function Service() {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      carouselRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className="pt-20 pb-10 relative overflow-hidden"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-50"
        style={{ backgroundColor: "var(--mobile-hover)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(var(--nav-text) 0.5px, transparent 0.5px), radial-gradient(var(--nav-text) 0.5px, var(--mobile-hover) 0.5px)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 10px 10px",
            opacity: "0.05",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--nav-text)" }}
          >
            Our Services
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            Comprehensive document generation solutions for your business needs
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 backdrop-blur-sm p-4 rounded-full shadow-lg transition-all -translate-x-1/2 border"
            style={{
              backgroundColor: "var(--mobile-bg)",
              borderColor: "var(--mobile-border)",
            }}
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
              style={{ color: "var(--nav-text)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <div
            ref={carouselRef}
            className="flex overflow-x-auto gap-6 pb-8 pt-4 px-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {services.map((service, index) => (
              <div
                key={index}
                className="flex-none w-[320px] h-[440px] snap-center rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300 flex flex-col transform hover:-translate-y-1"
                style={{ backgroundColor: "var(--mobile-bg)" }}
              >
                <div className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-t-2xl">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {service.isPopular && (
                    <div
                      className="absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
                      style={{
                        background:
                          "linear-gradient(to right, var(--btn-primary-bg), var(--btn-primary-hover))",
                      }}
                    >
                      Popular
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          backgroundColor: "var(--btn-primary-bg)",
                          color: "var(--btn-primary-text)",
                          opacity: 0.1,
                        }}
                      >
                        {service.icon}
                      </div>
                      <h3
                        className="text-xl font-semibold min-h-[56px] flex items-center"
                        style={{ color: "var(--nav-text)" }}
                      >
                        {service.title}
                      </h3>
                    </div>
                    <p
                      className="mb-6 text-sm min-h-[60px] leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {service.description}
                    </p>
                  </div>
                  <button
                    className="w-full text-white py-3 px-4 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] font-medium shadow-sm hover:shadow-md"
                    style={{
                      background:
                        "linear-gradient(to right, var(--btn-primary-bg), var(--btn-primary-hover))",
                    }}
                  >
                    <Link href={service.link}>{service.btn}</Link>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 backdrop-blur-sm p-4 rounded-full shadow-lg transition-all translate-x-1/2 border"
            style={{
              backgroundColor: "var(--mobile-bg)",
              borderColor: "var(--mobile-border)",
            }}
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
              style={{ color: "var(--nav-text)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
