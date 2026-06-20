import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { taskService } from '../services/api';
import TaskCard from '../components/TaskCard';
import Spinner from '../components/Spinner';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, Search, FolderCheck, ListTodo, Hourglass, CheckCircle2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = ({ addToast }) => {
  const navigate = useNavigate();

  // Tasks and statistics states
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const limit = 6; // Display 6 items per page for testing pagination layout

  // Filtering / Sorting states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sortBy, setSortBy] = useState('createdAt:desc');

  // Deletion Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch tasks hook
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        search,
        status,
        priority,
        sortBy
      };

      const data = await taskService.getTasks(params);
      setTasks(data.tasks);
      setTotalPages(data.pages);
      setTotalTasks(data.totalTasks);
      if (data.statistics) {
        setStatistics(data.statistics);
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, priority, sortBy, addToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setSortBy('createdAt:desc');
    setPage(1);
  };

  // Mark task as Completed trigger
  const handleMarkCompleted = async (id) => {
    try {
      await taskService.updateTaskStatus(id, 'Completed');
      addToast('Task marked as Completed!', 'success');
      fetchTasks();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update task status', 'error');
    }
  };

  // Open delete popup
  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
    setDeleteModalOpen(true);
  };

  // Confirm delete request
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await taskService.deleteTask(taskToDelete);
      addToast('Task deleted successfully', 'success');
      setDeleteModalOpen(false);
      setTaskToDelete(null);
      // Adjust page if deleting last item on current page
      if (tasks.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchTasks();
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to delete task', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">Workspace Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track your project tasks progress.</p>
        </div>
        <Link
          to="/add"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-theme-glow hover:shadow-theme-glow-hover hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <Plus size={16} />
          Create Task
        </Link>
      </div>

      {/* Statistics display panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks Card */}
        <div className="glass-panel p-5 rounded-xl flex items-center gap-4 shadow-premium border-t-4 border-t-indigo-500 transition-all duration-350 hover:shadow-indigo-500/10 hover:-translate-y-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 shadow-inner">
            <ListTodo size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Tasks</p>
            <h3 className="text-2xl font-black text-slate-950 dark:text-white mt-0.5">{statistics.total}</h3>
          </div>
        </div>

        {/* Pending Card */}
        <div className="glass-panel p-5 rounded-xl flex items-center gap-4 shadow-premium border-t-4 border-t-amber-500 transition-all duration-350 hover:shadow-amber-500/10 hover:-translate-y-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 shadow-inner">
            <Hourglass size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending</p>
            <h3 className="text-2xl font-black text-slate-950 dark:text-white mt-0.5">{statistics.pending}</h3>
          </div>
        </div>

        {/* In Progress Card */}
        <div className="glass-panel p-5 rounded-xl flex items-center gap-4 shadow-premium border-t-4 border-t-blue-500 transition-all duration-350 hover:shadow-blue-500/10 hover:-translate-y-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 shadow-inner">
            <FolderCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">In Progress</p>
            <h3 className="text-2xl font-black text-slate-950 dark:text-white mt-0.5">{statistics.inProgress}</h3>
          </div>
        </div>

        {/* Completed Card */}
        <div className="glass-panel p-5 rounded-xl flex items-center gap-4 shadow-premium border-t-4 border-t-emerald-500 transition-all duration-350 hover:shadow-emerald-500/10 hover:-translate-y-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 shadow-inner">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</p>
            <h3 className="text-2xl font-black text-slate-950 dark:text-white mt-0.5">{statistics.completed}</h3>
          </div>
        </div>
      </div>

      {/* Filters Form Panel */}
      <div className="glass-panel p-5 rounded-xl border border-slate-200/40 dark:border-slate-800/40 space-y-4 shadow-premium">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search box */}
          <div className="relative lg:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search by task title..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="block w-full pl-10 pr-4 py-2.5 border border-slate-200/60 dark:border-slate-800/60 rounded-xl bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-theme-primary-glow focus:border-theme-primary text-sm transition-all shadow-sm"
            />
          </div>

          {/* Status filter */}
          <div>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="block w-full px-4 py-2.5 border border-slate-200/60 dark:border-slate-800/60 rounded-xl bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-primary-glow focus:border-theme-primary text-sm transition-all shadow-sm"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority filter */}
          <div>
            <select
              value={priority}
              onChange={(e) => { setPriority(e.target.value); setPage(1); }}
              className="block w-full px-4 py-2.5 border border-slate-200/60 dark:border-slate-800/60 rounded-xl bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-primary-glow focus:border-theme-primary text-sm transition-all shadow-sm"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>

          {/* Sort selection */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="block w-full px-4 py-2.5 border border-slate-200/60 dark:border-slate-800/60 rounded-xl bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-primary-glow focus:border-theme-primary text-sm transition-all shadow-sm"
            >
              <option value="createdAt:desc">Newest Created</option>
              <option value="createdAt:asc">Oldest Created</option>
              <option value="dueDate:asc">Due Date Ascending</option>
              <option value="dueDate:desc">Due Date Descending</option>
            </select>
          </div>
        </div>

        {/* Display filter values indicator */}
        {(search || status || priority || sortBy !== 'createdAt:desc') && (
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Showing {totalTasks} matching tasks
            </span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs font-bold text-theme-primary hover:opacity-80 transition-all cursor-pointer"
            >
              <RotateCcw size={13} />
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Content Tasks Area */}
      {loading ? (
        <Spinner message="Syncing workspace task board..." />
      ) : tasks.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-xl max-w-2xl mx-auto flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800/50">
            <ListTodo size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No tasks found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              We couldn't find any tasks matching your filters. Try clearing your filters or create a new task.
            </p>
          </div>
          <Link
            to="/add"
            className="inline-flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-theme-primary-hover transition-all mt-2 cursor-pointer"
          >
            <Plus size={16} />
            Create First Task
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onMarkCompleted={handleMarkCompleted}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Page <span className="font-bold text-slate-950 dark:text-white">{page}</span> of{' '}
                <span className="font-bold text-slate-950 dark:text-white">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation modal dialog */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Task Confirmation"
        message="Are you sure you want to delete this task? This action cannot be undone and the task parameters will be permanently cleared from the workspace."
        onConfirm={handleConfirmDelete}
        onCancel={() => { setDeleteModalOpen(false); setTaskToDelete(null); }}
      />
    </div>
  );
};

export default Dashboard;
