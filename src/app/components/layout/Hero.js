export const Hero = () => {
  return (
    <div
      className="flex items-center justify-center"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center px-4 py-2 rounded-full border mobile-border mb-8"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--header-border)",
            }}
          >
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Trusted by 10,000+ users
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-none mb-6"
            style={{ color: "var(--foreground)" }}
          >
            Welcome to{" "}
            <span className="relative inline-block">
              <span style={{ color: "var(--foreground)" }}>Finyomatic</span>
              <div
                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                style={{ backgroundColor: "var(--foreground)" }}
              ></div>
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="mt-6 max-w-2xl mx-auto text-xl leading-relaxed sm:text-2xl"
            style={{ color: "var(--text-muted)" }}
          >
            Your personal financial management solution. Track expenses, manage
            budgets, and achieve your financial goals with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary group relative font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
              Get Started Free
              <svg
                className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>

            <button
              className="btn-secondary font-semibold px-8 py-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200"
              style={{ borderColor: "var(--foreground)" }}
            >
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
