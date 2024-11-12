import connectDb from '../../middleware/mongoose';
import Task from '../../models/Task';  // Your Task model

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { taskId, status } = req.body;

    // Check if both taskId and status are provided
    if (!taskId || !status) {
      return res.status(400).json({ message: 'Task ID and status are required' });
    }

    try {
      await connectDb();

      // Find the task by ID and update its status
      const task = await Task.findByIdAndUpdate(
        taskId,
        { status },  // Update the task's status
        { new: true }  // Return the updated task
      );

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Send the updated task back as a response
      res.status(200).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    // Handle method not allowed for other HTTP methods
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
