const Task = require('../models/Task');
const TaskStep = require('../models/TaskStep');
const AgentLog = require('../models/AgentLog');
const agentService = require('../services/agent.service');

// @desc Create a new task
// @route POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, autoRun } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Please provide task title and description' });
    }

    const task = await Task.create({
      userId: req.user._id,
      title,
      description,
      priority: priority || 'medium',
      status: 'pending',
    });

    const shouldAutoRun = autoRun !== undefined ? autoRun : req.user.preferences?.autoRunAgent ?? true;

    if (shouldAutoRun) {
      // Trigger background agent execution asynchronously
      setImmediate(() => {
        agentService.executeTask(task._id).catch((err) => {
          console.error(`[Background Task Execution Error] Task ${task._id}:`, err);
        });
      });
    }

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all user tasks
// @route GET /api/tasks
exports.getTasks = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = { userId: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single task details with steps and logs count
// @route GET /api/tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const steps = await TaskStep.find({ taskId: task._id }).sort({ order: 1 });
    const logs = await AgentLog.find({ taskId: task._id }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      task,
      steps,
      logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update task details
// @route PATCH /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { title, description, priority, status } = req.body;
    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (status) task.status = status;

    await task.save();

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete task
// @route DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await TaskStep.deleteMany({ taskId: task._id });
    await AgentLog.deleteMany({ taskId: task._id });
    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Run AI Agent execution on task
// @route POST /api/tasks/:id/run
exports.runTaskAgent = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Trigger background run
    setImmediate(() => {
      agentService.executeTask(task._id).catch((err) => {
        console.error(`[Manual Task Agent Run Error] Task ${task._id}:`, err);
      });
    });

    res.status(200).json({
      success: true,
      message: 'AI agent execution initiated in background',
      taskId: task._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Cancel running agent task
// @route POST /api/tasks/:id/cancel
exports.cancelTaskAgent = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.status = 'cancelled';
    await task.save();

    await AgentLog.create({
      taskId: task._id,
      type: 'info',
      message: 'Agent execution manually cancelled by user.',
    });

    res.status(200).json({
      success: true,
      message: 'Task agent execution cancelled',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get steps for a task
// @route GET /api/tasks/:id/steps
exports.getTaskSteps = async (req, res, next) => {
  try {
    const steps = await TaskStep.find({ taskId: req.params.id }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      steps,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Retry a specific failed step
// @route POST /api/tasks/:id/steps/:stepId/retry
exports.retryTaskStep = async (req, res, next) => {
  try {
    const { id: taskId, stepId } = req.params;
    const step = await agentService.retryStep(taskId, stepId);

    res.status(200).json({
      success: true,
      step,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get logs for a task
// @route GET /api/tasks/:id/logs
exports.getTaskLogs = async (req, res, next) => {
  try {
    const logs = await AgentLog.find({ taskId: req.params.id }).sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    next(error);
  }
};
