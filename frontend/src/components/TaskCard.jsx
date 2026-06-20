import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Trash2, Clock, Edit3, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

const TaskCard = ({ task, onMarkCompleted, onDeleteClick }) => {
  const { id, title, description, status, priority, dueDate, createdAt } = task;
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (statusVal) => {
    switch (statusVal) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25';
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/25';
      default:
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25';
    }
  };

  const getPriorityBadge = (priorityVal) => {
    switch (priorityVal) {
      case 'High':
        return 'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/25';
      case 'Medium':
        return 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/25';
      default:
        return 'bg-slate-500/10 text-slate-700 border-slate-500/20 dark:bg-slate-400/10 dark:text-slate-400 dark:border-slate-500/25';
    }
  };

  const getPriorityGlowClass = (priorityVal) => {
    switch (priorityVal) {
      case 'High':
        return 'glow-card-high';
      case 'Medium':
        return 'glow-card-medium';
      default:
        return 'glow-card-low';
    }
  };

  const isOverdue = () => {
    if (status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  return (
    <div className={`glass-panel glass-card rounded-2xl p-5 shadow-premium hover:shadow-2xl dark:bg-slate-900/60 transition-all duration-300 flex flex-col justify-between h-full relative border border-slate-200/40 dark:border-slate-800/40 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 ${getPriorityGlowClass(priority)}`}>
      <div>
        {/* Badge header selectors */}
        <div className="flex flex-wrap gap-2 mb-3.5 items-center justify-between">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wide ${getStatusBadge(status)}`}>
            {status}
          </span>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wide ${getPriorityBadge(priority)}`}>
            {priority} Priority
          </span>
        </div>

        {/* Task Title */}
        <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug line-clamp-1 mb-2" title={title}>
          {title}
        </h3>

        {/* Collapsible View details description block */}
        <div className="mb-4">
          <p className={`text-slate-500 dark:text-slate-400 text-sm whitespace-pre-wrap leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {description}
          </p>
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="flex items-center gap-1 mt-1 text-xs font-bold text-theme-primary hover:underline cursor-pointer"
          >
            {expanded ? (
              <>
                <ChevronUp size={13} />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown size={13} />
                View Details
              </>
            )}
          </button>
        </div>
      </div>

      {/* Date indicators */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3.5 mt-auto flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1" title="Created date">
            <Clock size={13} />
            <span>Created {formatDate(createdAt)}</span>
          </div>
          
          <div className={`flex items-center gap-1 font-semibold ${isOverdue() ? 'text-red-600 dark:text-red-400' : ''}`} title="Due date">
            {isOverdue() ? <ShieldAlert size={13} className="animate-pulse" /> : <Calendar size={13} />}
            <span>Due {formatDate(dueDate)}</span>
          </div>
        </div>

        {/* Item footer action buttons */}
        <div className="flex items-center justify-between gap-2 mt-2 border-t border-slate-50 dark:border-slate-850/50 pt-2.5">
          <div className="flex gap-2">
            {status !== 'Completed' && (
              <button
                onClick={() => onMarkCompleted(id)}
                className="flex items-center justify-center p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 transition-colors"
                title="Mark as Completed"
                aria-label="Complete task"
              >
                <CheckCircle size={16} />
              </button>
            )}
            <button
              onClick={() => navigate(`/edit/${id}`, { state: { task } })}
              className="flex items-center justify-center p-2 rounded-lg bg-theme-primary-opacity text-theme-primary hover:opacity-85 border border-theme-primary-opacity transition-all"
              title="Edit Task Parameters"
              aria-label="Edit task"
            >
              <Edit3 size={16} />
            </button>
          </div>
          
          <button
            onClick={() => onDeleteClick(id)}
            className="flex items-center justify-center p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40 border border-red-100 dark:border-red-900/50 transition-colors"
            title="Delete Task"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
