// DataIngestionContent.tsx
import React from "react";
import MessageBlock from "./data-ingestion/MessageBlock";
import MetricCard from "./data-ingestion/MetricCard";
import { CardMetric, MessageBlockProps } from "./data-ingestion/types";

const metrics: CardMetric[] = [
  { title: "Messages Processed", value: "1,247", change: "-12%" },
  { title: "Products Identified", value: "342", change: "+18%" },
  { title: "Working Capital Impact", value: "$2.4M", change: "+15%" },
  { title: "Cash Flow Velocity", value: "18 days", change: "-6" },
];

const messages: MessageBlockProps[] = [
  {
    source: "WHATSAPP",
    time: "Just now",
    rawMessage:
      "Need quote for Lancome La Vie Est Belle 100ml - 1,500 units. Client wants NET 45 payment. Can you do?",
    extracted: {
      product: "La Mer Moisturizing Cream",
      quantity: "800 units",
      price: "$180/unit",
      cashFlow: "COD payment ($144K)",
      workingCapital: "Immediate turnover",
      location: "Hong Kong",
      customer: "Purchase Order",
      urgency: "Medium",
    },
  },
  {
    source: "WHATSAPP",
    time: "2m ago",
    rawMessage:
      "Hi, urgent! Have 500 bottles Chanel No.5 (50ml). Need to move fast - offering 15% off. Cash this week please!",
    extracted: {
      product: "Chanel No.5 (50ml)",
      quantity: "500 units",
      price: "$85/unit (15% off)",
      cashFlow: "+$36.1k cash in (3 days)",
      workingCapital: "Frees $42.5k inventory",
      location: "Dubai warehouse",
      customer: "WhatsApp contact",
      urgency: "High",
    },
  },
  {
    source: "EMAIL",
    time: "5m ago",
    rawMessage: `Dear Partner,

We have excess stock: Dior Sauvage 100ml (2,000 units). Special bulk pricing available until month-end. Payment terms: Net 30.

Regards,
Sarah - Beauty Wholesale Corp`,
    extracted: {
      product: "Dior Sauvage (100ml)",
      quantity: "2,000 units",
      price: "$95/unit (bulk discount)",
      cashFlow: "Deferred 30 days ($190K)",
      workingCapital: "Ties $190k for 1 month",
      paymentTerms: "Net 30",
      location: "Singapore",
      customer: "Beauty Wholesale Corp",
      urgency: "Medium",
    },
  },
  {
    source: "PDF",
    time: "Just now",
    rawMessage: `INVENTORY ALERT - Aging Stock Report
Product: MAC Lipstick Collection
Quantity: 1,200 units
Unit Cost: $22
Days in Stock: 275 days
Expiration: 30 days
Recommendation: Immediate clearance required`,
    extracted: {
      product: "La Mer Moisturizing Cream",
      quantity: "800 units",
      price: "$180/unit",
      cashFlow: "COD payment ($144K)",
      workingCapital: "Immediate turnover",
      location: "Hong Kong",
      customer: "Purchase Order",
      urgency: "Medium",
    },
  },
];

const DataIngestionContent: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="w-full space-y-3 sm:space-y-4">
        {messages.map((message, index) => (
          <MessageBlock key={`${message.source}-${index}`} {...message} />
        ))}
      </div>
    </div>
  );
};

export default DataIngestionContent;
