import React, { useState } from "react";
import StatCardComponent, { StatCard } from "./StatCard";
import SignalsSection, { Signal } from "./overview/SignalsSection";
import ActivitySection, { Activity } from "./overview/ActivitySection";
import ChartSection from "./overview/ChartSection";
import DealsSection, { Deal } from "./overview/DealsSection";
import ChatModal from "./overview/ChatModal";


// Sample data - replace with actual data from your backend/API
const statCards: StatCard[] = [
  {
    label: "Active Opportunities",
    value: "14",
    delta: "+12",
    deltaTone: "up",
  },
  {
    label: "Potential Margin",
    value: "$847K",
    delta: "+9.7%",
    deltaTone: "up",
  },
  {
    label: "Avg. Confidence",
    value: "89%",
    delta: "+8.2%",
    deltaTone: "up",
  },
  {
    label: "Open Deals",
    value: "35%",
    delta: "+2%",
    deltaTone: "up",
  },
];

const signals: Signal[] = [
  {
    name: "Copper Wire (Grade A)",
    route: "Shanghai → Rotterdam",
    buyPrice: "$8,250",
    sellPrice: "$9,180",
    confidence: "94%",
    window: "4h window",
    margin: "+11.3%",
  },
  {
    name: "Steel Coils (HRC)",
    route: "Mumbai → Dubai",
    buyPrice: "$650",
    sellPrice: "$705",
    confidence: "87%",
    window: "6h window",
    margin: "+8.5%",
  },
  

{
    name: "Zinc Alloy",
    route: "Kuala Lumpur → Antwerp",
    buyPrice: "$2,420",
    sellPrice: "$2,640",
    confidence: "92%",
    window: "4.5h window",
    margin: "+9.1%",
  },
  {
    name: "Lead Ingots",
    route: "Ho Chi Minh → Busan",
    buyPrice: "$1,880",
    sellPrice: "$2,020",
    confidence: "86%",
    window: "3.8h window",
    margin: "+7.4%",
  },
  {
    name: "Iron Ore Fines",
    route: "Perth → Guangzhou",
    buyPrice: "$112",
    sellPrice: "$128",
    confidence: "90%",
    window: "5.2h window",
    margin: "+14.2%",
  },
  {
    name: "Scrap Metal (Mixed)",
    route: "Cairo → Istanbul",
    buyPrice: "$420",
    sellPrice: "$485",
    confidence: "84%",
    window: "6h window",
    margin: "+15.4%",
  },
  {
    name: "Polypropylene (PP)",
    route: "Singapore → Bangkok",
    buyPrice: "$1,120",
    sellPrice: "$1,245",
    confidence: "93%",
    window: "4h window",
    margin: "+11.2%",
  }
];


const activities: Activity[] = [
  {
    label: "Deal closed with TechCorp",
    time: "2 minutes ago",
    color: "bg-emerald-500",
  },
  {
    label: "New signal detected: ETH spike",
    time: "5 minutes ago",
    color: "bg-blue-500",
  },
  {
    label: "Customer engagement score +15%",
    time: "12 minutes ago",
    color: "bg-amber-500",
  },
  {
    label: "Portfolio rebalancing completed",
    time: "25 minutes ago",
    color: "bg-purple-500",
  },
];

const deals: Deal[] = [
  {
    company: "TechCorp Inc",
    product: "Enterprise License",
    likelihood: "High",
    suggestedPrice: "$85,000",
    expectedMargin: "28%",
    tags: ["Enterprise", "Q1 Target"],
  },
  {
    company: "CloudStart Labs",
    product: "API Integration",
    likelihood: "Medium",
    suggestedPrice: "$12,500",
    expectedMargin: "42%",
    tags: ["SMB", "Fast Close"],
  },
];

const OverviewContent: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);

  const handleAskAI = (signalName: string) => {
    setSelectedSignal(signalName);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedSignal(null);
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
     
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statCards.map((card) => (
          <StatCardComponent key={card.label} card={card} />
        ))}
      </div>

     
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      
        <div className="lg:col-span-2 min-h-0 overflow-y-auto">
          <SignalsSection signals={signals} onAskAI={handleAskAI} />
        </div>
        
        {/* Activity section - takes full width on mobile, 1 column on large screens */}
        <div className="min-h-0 overflow-y-auto">
          <ActivitySection activities={activities} />
        </div>
      </div>

      {/* Chart area - full width and responsive */}
      <div className="w-full overflow-x-auto">
        <ChartSection />
      </div>

      {/* Deal recommendations - responsive */}
      <div className="w-full">
        <DealsSection deals={deals} onAskAI={handleAskAI} />
      </div>

      {/* Chat modal controlled by OverviewContent */}
      <ChatModal
        open={isChatOpen}
        signalName={selectedSignal}
        onClose={handleCloseChat}
      />

    </div>
  );
};

export default OverviewContent;
