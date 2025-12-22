import React from "react";
import { MessageSquare, Zap, Database, CheckCircle } from "lucide-react";

const steps = [
  { icon: MessageSquare, label: "Raw Sources", sublabel: "WhatsApp, Email, PDF" },
  { icon: Zap, label: "AI Processing", sublabel: "NLP & Entity Extract" },
  { icon: Database, label: "Structured Data", sublabel: "Normalized Format" },
  { icon: CheckCircle, label: "Intelligence Layer", sublabel: "Ready for Action" },
];

const IngestionPipelineFlow: React.FC = () => {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6 md:p-8 shadow-sm">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 text-slate-800">
        Ingestion Pipeline Flow
      </h2>

      <div className="flex items-center gap-4 sm:gap-6 md:gap-10 overflow-x-auto pb-4 justify-between scrollbar-hide">

        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-4 sm:gap-6 md:gap-10 flex-shrink-0">

            {/* ICON + LABEL */}
            <div className="text-center min-w-[100px] sm:min-w-[130px]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 
                              flex items-center justify-center shadow-md mb-2 sm:mb-3 mx-auto">
                <step.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="font-semibold text-sm sm:text-base text-slate-900">{step.label}</div>
              <div className="text-xs sm:text-sm text-slate-500">{step.sublabel}</div>
            </div>

            {/* GRADIENT LINE + ARROW */}
            {index < steps.length - 1 && (
              <div className="flex items-center flex-shrink-0">
                <div className="w-8 sm:w-12 md:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full" />
                <div className="w-0 h-0 
                                border-t-[3px] sm:border-t-4 border-b-[3px] sm:border-b-4 border-l-[6px] sm:border-l-8 
                                border-t-transparent border-b-transparent 
                                border-l-violet-500"></div>
              </div>
            )}

          </div>
        ))}

      </div>
    </div>
  );
};

export default IngestionPipelineFlow;
