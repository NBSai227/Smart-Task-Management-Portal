const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [20, 'Description must be at least 20 characters long'],
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['Pending', 'In Progress', 'Completed'],
      message: 'Status must be Pending, In Progress, or Completed'
    },
    default: 'Pending'
  },
  priority: {
    type: String,
    required: true,
    enum: {
      values: ['Low', 'Medium', 'High'],
      message: 'Priority must be Low, Medium, or High'
    },
    default: 'Medium'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(value) {
        // Only enforce validation on new documents or if dueDate is modified
        if (this.isNew || this.isModified('dueDate')) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const inputDate = new Date(value);
          inputDate.setHours(0, 0, 0, 0);
          return inputDate >= today;
        }
        return true;
      },
      message: 'Due date cannot be a previous date'
    }
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Transform output to expose clean client-friendly 'id'
TaskSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Task', TaskSchema);
