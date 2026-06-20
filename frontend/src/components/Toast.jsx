import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ id, message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const borderStyles = type === 'success' 
    ? 'border-l-4 border-emerald-500' 
    : 'border-l-4 border-red-500';

  const iconColor = type === 'success' ? 'text-emerald-500' : 'text-red-500';

  return (
    <div className={`flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 min-w-[300px] max-w-[450px] shadow-lg animate-slide-in ${borderStyles}`} role="alert">
      <span className={iconColor}>
        {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      </span>
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex-grow pr-2">{message}</div>
      <button 
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" 
        onClick={() => onClose(id)}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
