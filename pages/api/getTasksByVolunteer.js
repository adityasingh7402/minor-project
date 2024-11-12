// pages/api/getTasksByVolunteer.js
import connectDb from '../../middleware/mongoose';
import Task from '../../models/Task';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const { volunteerId } = req.query;

    if (!volunteerId) {
      return res.status(400).json({ message: 'Volunteer ID is required' });
    }

    try {
      const tasks = await Task.find({ volunteerId }).sort({ taskEndDate: -1 });

      if (!tasks.length) {
        return res.status(404).json({ message: 'No tasks found for this volunteer' });
      }

      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({ message: 'Server error, please try again' });
    }
  }

  if (req.method === 'DELETE') {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' });
    }

    try {
      // Find and delete the task
      const task = await Task.findByIdAndDelete(taskId);

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({ message: 'Server error, please try again' });
    }
  }

  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
};

export default connectDb(handler);
