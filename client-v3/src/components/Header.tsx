import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NotificationDropdown } from "./NotificationDropdown";

function Header() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-[rgba(var(--color-bg-tertiary),0.75)] border-b border-white/5">
      <header className="mx-auto max-w-7xl h-16 px-4 flex items-center justify-between">

        {/* Logo + Tagline (INLINE like image) */}
        <Link to="/" className="flex items-center gap-4">
          <img
            src="/image/image.png"
            alt="Tionale Logo"
            className="h-9 w-auto object-contain brightness-125 contrast-125"
          />

          <span className="mt-10 text-sm font-medium text-[rgb(var(--color-text-tertiary))] tracking-wide">
            Revenue Intelligence Platform
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-6 relative">
          <div className="hidden sm:flex items-center gap-2 text-xs text">
            <span className="h-2 w-2 rounded-full bg-[rgb(var(--color-status-active))]" />
            <span className="font-medium">Live</span>
            <span className="opacity-40">•</span>
            <span>{time}</span>
          </div>

          <NotificationDropdown />
        </div>
      </header>
      {/* Horizontal grey line below header */}
      <div className="w-full h-px bg-gray-300/60" />
    </div>
  );
}

export default Header;


