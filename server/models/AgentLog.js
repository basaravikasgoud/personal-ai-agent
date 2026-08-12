const mongoose = require('mongoose');

const agentLogSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['info', 'step_start', 'step_complete', 'tool_call', 'tool_result', 'error', 'finish'],
      default: 'info',
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model('AgentLog', agentLogSchema);
