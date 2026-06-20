import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { taskService } from '../services/api';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

const AddTask = ({ addToast }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    if (name === 'title' && !value.trim()) {
      error = 'Title is required';
    } else if (name === 'description') {
      if (!value.trim()) {
        error = 'Description is required';
      } else if (value.trim().length < 20) {
        error = `Description must be at least 20 characters long (current: ${value.trim().length})`;
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Live validation check on keystroke
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields on submit
    const titleError = validateField('title', formData.title);
    const descError = validateField('description', formData.description);
    
    if (titleError || descError) {
      setErrors({
        title: titleError,
        description: descError
      });
      addToast('Please resolve validation errors before saving.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await taskService.createTask(formData);
      addToast('Task created successfully!', 'success');
      navigate('/');
    } catch (error) {
      console.error(error);
      addToast(error.response?.data?.message || 'Failed to create task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const descLen = formData.description.trim().length;

  return (
    <div>
      <div className="page-intro">
        <div>
          <h1>Create New Task</h1>
          <p>Add a task to the queue with description and status parameters.</p>
        </div>
        <Link to="/" className="btn" style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          {/* Title input field */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">Task Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Integrate Payment API"
              className="form-control"
              style={errors.title ? { borderColor: 'var(--danger-text)' } : {}}
            />
            {errors.title && (
              <span className="form-error">
                <AlertCircle size={14} />
                {errors.title}
              </span>
            )}
          </div>

          {/* Description text area */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">Task Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the task details clearly. Minimum 20 characters required..."
              className="form-control"
              style={errors.description ? { borderColor: 'var(--danger-text)' } : {}}
            />
            <div className="form-hint">
              <span className="form-error" style={{ margin: 0, opacity: errors.description ? 1 : 0 }}>
                {errors.description && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertCircle size={14} />
                    {errors.description}
                  </span>
                )}
              </span>
              <span style={{ color: descLen >= 20 ? 'var(--status-completed-text)' : 'var(--text-secondary)', fontWeight: 600 }}>
                {descLen} / 20 chars min
              </span>
            </div>
          </div>

          {/* Status select dropdown */}
          <div className="form-group">
            <label htmlFor="status" className="form-label">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-control"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="form-actions">
            <Link to="/" className="btn" style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              id="save-task-btn"
            >
              <Save size={16} />
              {isSubmitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
