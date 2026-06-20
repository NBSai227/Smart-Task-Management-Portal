import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { taskService } from '../services/api';
import { ArrowLeft, Save, Plus, Loader2 } from 'lucide-react';

const TaskForm = ({ addToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id;

  // Form fields states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Format date helper to feed YYYY-MM-DD to HTML date input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if due date lies in the past
  const isPastDate = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const input = new Date(dateString);
    input.setHours(0, 0, 0, 0);
    return input < today;
  };

  // Populate data when editing a task
  useEffect(() => {
    if (isEditMode) {
      // If task is forwarded in router state, load it immediately (fast UX)
      if (location.state?.task) {
        const { task } = location.state;
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setPriority(task.priority);
        setDueDate(formatDateForInput(task.dueDate));
      } else {
        // Fallback: fetch single task (or redirect if error)
        const fetchTask = async () => {
          try {
            setLoading(true);
            // Fetch tasks list filtered by ID (since we have page query, we can query general list or single task,
            // let's fetch matching tasks or let task service return general lists)
            const data = await taskService.getTasks({ search: '' });
            const matchingTask = data.tasks.find(t => t.id === id);
            if (matchingTask) {
              setTitle(matchingTask.title);
              setDescription(matchingTask.description);
              setStatus(matchingTask.status);
              setPriority(matchingTask.priority);
              setDueDate(formatDateForInput(matchingTask.dueDate));
            } else {
              addToast('Task details could not be found', 'error');
              navigate('/');
            }
          } catch (error) {
            addToast('Error fetching task details', 'error');
            navigate('/');
          } finally {
            setLoading(false);
          }
        };
        fetchTask();
      }
    }
  }, [id, isEditMode, location.state, addToast, navigate]);

  // Validates inputs
  const validateForm = () => {
    const errors = {};
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    if (!description.trim()) {
      errors.description = 'Description is required';
    } else if (description.trim().length < 20) {
      errors.description = `Description must be at least 20 characters (current: ${description.length})`;
    }
    if (!dueDate) {
      errors.dueDate = 'Due date is required';
    } else if (!isEditMode && isPastDate(dueDate)) {
      // Past date check only enforced on creation
      errors.dueDate = 'Due date cannot be a previous date';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate
      };

      if (isEditMode) {
        await taskService.updateTask(id, payload);
        addToast('Task updated successfully!', 'success');
      } else {
        await taskService.createTask(payload);
        addToast('Task created successfully!', 'success');
      }
      navigate('/');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to save task parameters', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      {/* Return button row */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/50 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-all shadow-sm hover:scale-105"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isEditMode ? 'Modify Task Details' : 'Create New Task'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isEditMode ? 'Update the parameters of your existing task.' : 'Add a new task to your taskflow board.'}
          </p>
        </div>
      </div>

      {/* Main form container */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 shadow-premium">
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {/* Title row */}
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-slate-700 dark:text-slate-350">
              Task Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`block w-full mt-1.5 px-4 py-2.5 border rounded-xl bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-theme-primary-glow focus:border-theme-primary text-sm transition-all shadow-sm ${
                formErrors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200/65 dark:border-slate-800/65'
              }`}
              placeholder="e.g. Implement JWT Auth"
            />
            {formErrors.title && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-semibold">{formErrors.title}</p>
            )}
          </div>

          {/* Description row with character counter */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="description" className="block text-sm font-bold text-slate-700 dark:text-slate-350">
                Description
              </label>
              <span className={`text-xs ${description.trim().length >= 20 ? 'text-slate-400' : 'text-amber-500 font-semibold'}`}>
                {description.trim().length} chars (min 20)
              </span>
            </div>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`block w-full mt-1.5 px-4 py-2.5 border rounded-xl bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-theme-primary-glow focus:border-theme-primary text-sm transition-all shadow-sm ${
                formErrors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200/65 dark:border-slate-800/65'
              }`}
              placeholder="Write a clear, descriptive summary of the task to be performed..."
            />
            {formErrors.description && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-semibold">{formErrors.description}</p>
            )}
          </div>

          {/* Status & Priority select row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-bold text-slate-700 dark:text-slate-350">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full mt-1.5 px-4 py-2.5 border border-slate-200/60 dark:border-slate-800/60 rounded-xl bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-primary-glow focus:border-theme-primary text-sm transition-all shadow-sm"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-bold text-slate-700 dark:text-slate-350">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="block w-full mt-1.5 px-4 py-2.5 border border-slate-200/60 dark:border-slate-800/60 rounded-xl bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-primary-glow focus:border-theme-primary text-sm transition-all shadow-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Due date row */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-bold text-slate-700 dark:text-slate-350">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`block w-full mt-1.5 px-4 py-2.5 border rounded-xl bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-theme-primary-glow focus:border-theme-primary text-sm transition-all shadow-sm ${
                formErrors.dueDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200/65 dark:border-slate-800/65'
              }`}
            />
            {formErrors.dueDate && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-semibold">{formErrors.dueDate}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
            <Link
              to="/"
              className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-theme-glow hover:shadow-theme-glow-hover transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {isEditMode ? <Save size={16} /> : <Plus size={16} />}
                  {isEditMode ? 'Save Changes' : 'Create Task'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
