import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundColor: "rgb(var(--color-bg-secondary))",
        color: "rgb(var(--color-text-primary))",
      }}
    >
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
