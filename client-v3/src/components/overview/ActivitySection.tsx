import React from "react";

export type Activity = {
  label: string;
  time: string;
  color: string;
};

interface ActivitySectionProps {
  activities: Activity[];
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ activities }) => {
  return (
    <div className="card-flat flex flex-col h-full">
      <div className="mb-3 sm:mb-4 flex-shrink-0">
        <h2 className="text-base sm:text-lg font-semibold" style={{ color: 'rgb(var(--color-text-primary))' }}>
          Live Activity
        </h2>
        <p className="text-xs sm:text-sm" style={{ color: 'rgb(var(--color-text-tertiary))' }}>
          Latest optimization and customer behavior signals
        </p>
      </div>

      <div className="space-y-2 sm:space-y-3 overflow-y-auto flex-1 pr-1">
        {activities.map((a, idx) => (
          <div key={idx} className="flex items-start justify-between">
              <div className="flex items-start gap-2 sm:gap-3">
              <span
                className={`mt-0.5 sm:mt-1 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${a.color} flex-shrink-0`}
              />
              <div>
                <p className="text-xs sm:text-sm font-medium break-words" style={{ color: 'rgb(var(--color-text-tertiary))' }}>
                  {a.label}
                </p>
                <p className="text-xs sm:text-sm" style={{ color: 'rgb(var(--color-text-quaternary))' }}>{a.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitySection;
