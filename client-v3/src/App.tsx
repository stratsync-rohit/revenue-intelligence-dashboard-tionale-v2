import React, { useState } from "react";
import Layout from "./components/Layout";
import HeaderSlider from "./components/HeaderSlider";
import DataIngestionContent from "./components/DataIngestionContent";
import OverviewContent from "./components/OverviewContent";




const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "dataIngestion">(
    "overview"
  );

  return (
    <Layout>
      <div className="mx-auto max-w-7xl w-full px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
        {/* Tabs */}
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
