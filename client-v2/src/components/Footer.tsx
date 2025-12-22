import React from "react";

function Footer() {
  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="fixed inset-x-0 bottom-0 z-40 backdrop-blur border-t"
      style={{
        backgroundColor: "rgba(var(--color-bg-tertiary), 0.9)",
        borderColor: "rgb(var(--color-border-medium))",
      }}
    >
      <div
        className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 py-3 sm:py-3"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-2 sm:gap-0">
          <div
            className="text-center sm:text-left text-sm sm:text-base"
            style={{ color: "rgb(var(--color-text-tertiary))" }}
          >
            © {new Date().getFullYear()} StratSync. All rights reserved.
          </div>

          <div className="flex items-center gap-2 sm:gap-2">
            <span
              className="text-sm sm:text-base"
              style={{ color: "rgb(var(--color-text-tertiary))" }}
            >
              Powered by
            </span>

            <a
              href="https://www.stratsync.ai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="StratSync website (opens in new tab)"
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[rgb(var(--color-bg-primary)/0.06)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 transition"
            >
              <img
                src="/image/logo.jpeg"
                alt="StratSync logo"
                className="h-4 w-4 sm:h-5 sm:w-5 rounded-full object-cover"
                width={20}
                height={20}
              />
              <span
                className="text-sm sm:text-base font-semibold"
                style={{ color: "rgb(var(--color-text-primary))" }}
              >
                StratSync
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
