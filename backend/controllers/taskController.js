import VolunteerTask from '../models/VolunteerTask.js';
import User from '../models/User.js';
import Volunteer from '../models/Volunteer.js';

// @desc    Create task(s) and assign to volunteers
// @route   POST /api/tasks
// @access  Private/Admin
export const createTask = async (req, res, next) => {
  try {
    const { title, description, appreciationMessage, targetType, targetUserIds } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    let userIds = [];

    if (targetType === 'all') {
      // Assign to all users with role 'user' (volunteers)
      const allVolunteers = await User.find({ role: 'user' }).select('_id');
      userIds = allVolunteers.map((u) => u._id);
    } else if (targetType === 'multiple' && Array.isArray(targetUserIds) && targetUserIds.length > 0) {
      // targetUserIds are Volunteer _ids. Find corresponding User _ids via email.
      const vols = await Volunteer.find({ _id: { $in: targetUserIds } }).select('email');
      const emails = vols.map((v) => v.email.toLowerCase());
      const users = await User.find({ email: { $in: emails } }).select('_id');
      userIds = users.map((u) => u._id);
    } else if (targetType === 'single' && targetUserIds) {
      const vol = await Volunteer.findById(targetUserIds).select('email');
      if (vol) {
        const user = await User.findOne({ email: vol.email.toLowerCase() }).select('_id');
        if (user) userIds = [user._id];
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid target assignment. Provide targetType and targetUserIds.' });
    }

    if (userIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid volunteers found to assign this task.' });
    }

    const taskDocs = userIds.map((userId) => ({
      title,
      description,
      appreciationMessage: appreciationMessage || undefined,
      assignedTo: userId,
      assignedBy: req.user._id,
    }));

    const created = await VolunteerTask.insertMany(taskDocs);

    res.status(201).json({
      success: true,
      message: `Task assigned to ${created.length} volunteer(s) successfully.`,
      count: created.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks (admin view)
// @route   GET /api/tasks
// @access  Private/Admin
export const getAdminTasks = async (req, res, next) => {
  try {
    const tasks = await VolunteerTask.find()
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my tasks (volunteer view)
// @route   GET /api/tasks/my
// @access  Private
export const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await VolunteerTask.find({ assignedTo: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a task as completed
// @route   PUT /api/tasks/:id/complete
// @access  Private
export const completeTask = async (req, res, next) => {
  try {
    const task = await VolunteerTask.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Make sure the logged-in user is the assignee
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to complete this task' });
    }

    if (task.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Task is already marked as completed' });
    }

    task.status = 'completed';
    task.completedAt = new Date();
    await task.save();

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
export const deleteTask = async (req, res, next) => {
  try {
    const task = await VolunteerTask.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
