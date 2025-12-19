import React from 'react';

export const PageHeader: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      {action && <div>{action}</div>}
    </div>
  );
};
