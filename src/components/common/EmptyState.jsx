import React from 'react';
import { Film, AlertCircle } from 'lucide-react';

export default function EmptyState({
  title = 'No Stories Found',
  description = 'There are no items available in this category yet.',
  action = null,
  icon: Icon = Film,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-border border-dashed rounded-xl bg-surface/40 my-6">
      <div className="p-4 rounded-full bg-surface-elevated text-accent-red mb-4 border border-border">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-heading font-semibold text-content-primary mb-2">
        {title}
      </h3>
      <p className="text-sm text-content-secondary max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
