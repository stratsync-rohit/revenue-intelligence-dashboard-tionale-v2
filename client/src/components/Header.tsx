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
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/80">
            <span className="h-2 w-2 rounded-full bg-[rgb(var(--color-status-active))]" />
            <span className="font-medium">Live</span>
            <span className="opacity-40">•</span>
            <span>{time}</span>
          </div>

          <NotificationDropdown />
        </div>
      </header>
    </div>
  );
}

export default Header;



// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { NotificationDropdown } from "./NotificationDropdown";

// function Header() {
//   const [time, setTime] = useState(
//     new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//   );

//   useEffect(() => {
//     const t = setInterval(() => {
//       setTime(
//         new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       );
//     }, 60000);
//     return () => clearInterval(t);
//   }, []);

//   return (
//     <div className="fixed top-0 inset-x-0 z-50">
//       {/* Subtle glass layer */}
//       <div className="backdrop-blur-xl bg-[rgba(8,15,30,0.65)] border-b border-white/5">
//         <header className="mx-auto max-w-7xl h-16 px-8 flex items-center justify-between">

//           {/* LEFT — Brand */}
//           <Link to="/" className="flex items-center gap-3 group">
//             <img
//               src="/image/image.png"
//               alt="Tionale"
//               className="h-8 w-auto object-contain  brightness-125 contrast-125 transition-opacity group-hover:opacity-90"
//             />

//             <div className="hidden sm:flex flex-col leading-tight">
//               <span className="text-sm font-semibold text-white tracking-tight">
//                 Tionale
//               </span>
//               <span className="text-xs text-white/50">
//                 Revenue Intelligence
//               </span>
//             </div>
//           </Link>

//           {/* RIGHT — Status + Actions */}
//           <div className="flex items-center gap-6">
//             <div className="hidden md:flex items-center gap-3 text-xs text-white/70">
//               <span className="flex items-center gap-2">
//                 <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
//                 Live
//               </span>
//               <span className="opacity-40">•</span>
//               <span>{time}</span>
//             </div>

//             <NotificationDropdown />
//           </div>

//         </header>
//       </div>
//     </div>
//   );
// }

// export default Header;

