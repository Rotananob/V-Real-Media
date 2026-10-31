import React from 'react';
import { Film } from 'lucide-react';

export default function EmptyState({
  title = 'No Stories Found',
  description = 'There are no items available in this category yet.',
  action = null,
  icon: Icon = Film,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-neutral-200 border-dashed rounded-2xl bg-white my-6 font-khmer shadow-xs">
      <div className="p-3.5 rounded-full bg-neutral-100 text-neutral-600 mb-3 border border-neutral-200">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-neutral-900 mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-neutral-500 max-w-md mb-5 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
