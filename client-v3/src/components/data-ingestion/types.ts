export type CardMetric = {
  title: string;
  value: string;
  change: string;
};

export type ExtractedData = {
  product: string;
  quantity: string;
  price?: string;
  cashFlow: string;
  workingCapital: string;
  location: string;
  customer: string;
  urgency: string;
  paymentTerms?: string;
};

export type MessageBlockProps = {
  source: "WHATSAPP" | "EMAIL" | "PDF" | string;
  time: string;
  rawMessage: string;
  extracted: ExtractedData;
};

export type ButtonVariant = "primary" | "secondary";
