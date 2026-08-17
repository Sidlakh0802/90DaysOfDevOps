const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Get environment variables or fallback to defaults
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tasks';

// 1. Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('🟢 Connected to MongoDB Successfully!'))
  .catch(err => console.error('🔴 MongoDB Connection Error:', err));

// 2. Define a simple Task Model
const TaskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false }
});
const Task = mongoose.model('Task', TaskSchema);

// 3. API Routes
// GET route to check if the API is running
app.get('/', (req, res) => {
  res.send('<h1>Task Manager API is running! 🚀</h1>');
});

// GET route to fetch all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST route to create a new task
app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task({ title: req.body.title });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
