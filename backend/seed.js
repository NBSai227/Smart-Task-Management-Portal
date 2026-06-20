require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Task = require('./models/Task');

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('Clearing existing seed users and tasks...');
    const email = 'john@example.com';
    
    // Find or create test user
    let user = await User.findOne({ email });
    if (user) {
      await Task.deleteMany({ userId: user._id });
      console.log('Cleared existing tasks for user.');
    } else {
      user = await User.create({
        name: 'John Doe',
        email,
        password: 'password123'
      });
      console.log('Created test user:', email);
    }

    // Set relative dates
    const today = new Date();
    
    const pastDateCompleted = new Date();
    pastDateCompleted.setDate(today.getDate() - 5);
    
    const futureDateHigh = new Date();
    futureDateHigh.setDate(today.getDate() + 2);
    
    const futureDateMedium = new Date();
    futureDateMedium.setDate(today.getDate() + 7);
    
    const pastDateOverdue = new Date();
    pastDateOverdue.setDate(today.getDate() - 1);

    // Array of sample tasks representing all visual states and styles
    const sampleTasks = [
      {
        userId: user._id,
        title: 'Design Database Schemas',
        description: 'Define mongoose schemas for users and tasks with strong validation rules and clean JSON transforms to map database parameters.',
        status: 'Completed',
        priority: 'Low',
        dueDate: pastDateCompleted
      },
      {
        userId: user._id,
        title: 'Implement JWT Authentication',
        description: 'Create sign-up and login endpoints, write token verification middleware, and configure Axios client request interceptors to pass headers.',
        status: 'In Progress',
        priority: 'High',
        dueDate: futureDateHigh
      },
      {
        userId: user._id,
        title: 'Write E2E Verification Plan',
        description: 'Draft postman collection, test endpoints, verify pagination skipping parameters, and check dashboard statistics counts under various users.',
        status: 'Pending',
        priority: 'Medium',
        dueDate: futureDateMedium
      },
      {
        userId: user._id,
        title: 'Refactor Frontend Layout & CSS',
        description: 'Clean unused styles, implement custom scrollbars, write slide-in toast notification keyframes, and configure premium dark theme colors.',
        status: 'Pending',
        priority: 'High',
        dueDate: pastDateOverdue // Overdue task - triggers red warning indicator
      }
    ];

    // Insert tasks bypassing mongoose validation to allow historical overdue seeding
    for (const taskData of sampleTasks) {
      const task = new Task(taskData);
      await task.save({ validateBeforeSave: false });
    }
    console.log('Database seeded successfully with tasks showing different priority and status styles!');
    
    // Close DB connection
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();
