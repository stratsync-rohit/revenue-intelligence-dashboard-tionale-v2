import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NotificationDropdown } from "./NotificationDropdown";

function Header() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  /* Live clock */
  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-40 backdrop-blur  bg-[rgba(var(--color-bg-tertiary),0.8)]">
      <header className="mx-auto max-w-7xl flex justify-between items-center  py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          {/* Logo Image */}
          <img
            src="/image/image.png"
            alt="Tionale Logo"
            className="h-10 object-contain"
          />

          {/* Tagline */}
          <span className=" mt-10 text-sm font-medium text-[rgb(var(--color-text-tertiary))]">
            Revenue Intelligence Platform
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-6">
          {/* Live */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-[rgb(var(--color-status-active))]" />
            <span className="font-medium">Live</span>
            <span className="opacity-50">•</span>
            <span>{time}</span>
          </div>

        
          <NotificationDropdown />
        </div>
      </header>
    </div>
  );
}

export default Header;
