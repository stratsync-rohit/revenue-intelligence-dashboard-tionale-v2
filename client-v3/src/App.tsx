import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import HeaderSlider from "./components/HeaderSlider";
import DataIngestionContent from "./components/DataIngestionContent";
import OverviewContent from "./components/OverviewContent";

// TypeScript: Add global window.USER_CSS_URL declaration
declare global {
  interface Window {
    USER_CSS_URL?: string;
  }
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "dataIngestion">("overview");

  useEffect(() => {
    
    fetch("/api/get-user-css-url")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.url) {
          window.USER_CSS_URL = data.url;
          
          if (!document.querySelector(`link[href='${data.url}']`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = data.url;
            document.head.appendChild(link);
          }
        }
      });
  }, []);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl w-full px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
       
        <HeaderSlider activeTab={activeTab} onChange={setActiveTab} />

        {/* Content based on tab with smooth transition */}
        <div className="relative">
          <div
            key={activeTab}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {activeTab === "overview" ? (
              <OverviewContent />
            ) : (
              <DataIngestionContent />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
