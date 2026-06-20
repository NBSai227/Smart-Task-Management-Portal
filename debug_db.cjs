require('dotenv').config({ path: require('path').join(__dirname, 'backend/.env') });
const mongoose = require('mongoose');
const Task = require('./backend/models/Task');
const User = require('./backend/models/User');

const debug = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  
  console.log('--- USERS ---');
  const users = await User.find({});
  users.forEach(u => console.log(`User: ${u.name} | ID: ${u._id} | Email: ${u.email}`));

  console.log('\n--- TASKS ---');
  const tasks = await Task.find({});
  tasks.forEach(t => console.log(`Task: ${t.title} | ID: ${t._id} | UserID: ${t.userId}`));

  mongoose.connection.close();
};

debug();
