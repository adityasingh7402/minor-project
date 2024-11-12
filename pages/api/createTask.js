// pages/api/createTask.js
import connectDb from '../../middleware/mongoose';
import Task from '../../models/Task';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { taskTitle, taskDescription, taskEndDate, volunteerId, ngoId } = req.body;

    // Validate required fields
    if (!taskTitle || !taskDescription || !taskEndDate || !volunteerId || !ngoId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      // Create a new task
      const newTask = new Task({
        taskTitle,
        taskDescription,
        taskEndDate,
        volunteerId,
        ngoId,
        status: 'Pending', // default status
      });

      // Save the task to the database
      const savedTask = await newTask.save();

      return res.status(201).json(savedTask); // Return the saved task
    } catch (error) {
      console.error('Error saving task:', error);
      return res.status(500).json({ message: 'Server error, please try again' });
    }
  }

  // Method Not Allowed
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
};

export default connectDb(handler);
