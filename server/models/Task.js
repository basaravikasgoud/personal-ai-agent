const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'planning', 'running', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    plan: {
      goal: { type: String },
      summary: { type: String },
      totalSteps: { type: Number, default: 0 },
      dependencies: [String],
    },
    result: {
      summary: { type: String },
      output: { type: String },
      completedAt: { type: Date },
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
