import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = ({ message = 'Loading details...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3" role="status">
      <Loader2 size={40} className="text-indigo-600 dark:text-indigo-400 animate-spin-slow" />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
};

export default Spinner;
