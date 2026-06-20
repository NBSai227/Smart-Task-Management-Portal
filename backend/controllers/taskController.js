const Task = require('../models/Task');

// @desc    Get all workspace tasks with filters, sorting, and pagination
// @route   GET /api/tasks
// @access  Public (No Login Required)
exports.getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, sortBy, page = 1, limit = 10 } = req.query;

    // Filter scoped to user tasks
    const query = { userId: req.user._id };

    // Search query
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Priority filter
    if (priority) {
      query.priority = priority;
    }

    // Sorting settings
    let sort = {};
    if (sortBy) {
      const parts = sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default: newest first
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Fetch matching tasks
    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const totalFiltered = await Task.countDocuments(query);

    // Compute overall workspace stats (independent of active page filters)
    const statsQuery = await Task.aggregate([
      {
        $match: { userId: req.user._id }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statistics = {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0
    };

    statsQuery.forEach(item => {
      const statusKey = item._id === 'In Progress' ? 'inProgress' : item._id.toLowerCase();
      statistics[statusKey] = item.count;
      statistics.total += item.count;
    });

    res.status(200).json({
      tasks,
      page: pageNum,
      pages: Math.ceil(totalFiltered / limitNum),
      totalTasks: totalFiltered,
      statistics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public (No Login Required)
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = new Task({
      userId: req.user._id,
      title,
      description,
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Public (No Login Required)
exports.updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    task.title = title !== undefined ? title : task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status !== undefined ? status : task.status;
    task.priority = priority !== undefined ? priority : task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Update only task status
// @route   PATCH /api/tasks/:id/status
// @access  Public (No Login Required)
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      res.status(400);
      throw new Error('Status is required');
    }

    const allowedStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!allowedStatuses.includes(status)) {
      res.status(400);
      throw new Error('Invalid status. Must be Pending, In Progress, or Completed');
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    task.status = status;
    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public (No Login Required)
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};
