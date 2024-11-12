// models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO', // Reference to the NGO model
        required: true,
    },
    volunteerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer', // Reference to the Volunteer model
        required: true,
    },
    taskTitle: {
        type: String,
        required: true,
    },
    taskDescription: {
        type: String,
        required: true,
    },
    taskEndDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending',
    },
}, { timestamps: true });

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;
