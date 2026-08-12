const Task = require('../models/Task');
const TaskStep = require('../models/TaskStep');
const AgentLog = require('../models/AgentLog');
const grokService = require('./grok.service');
const toolManager = require('../tools/toolManager');

class AgentService {
  /**
   * Helper to write an activity log entry
   */
  async log(taskId, type, message, metadata = {}) {
    console.log(`[AgentLog - ${type.toUpperCase()}] Task ${taskId}: ${message}`);
    return await AgentLog.create({
      taskId,
      type,
      message,
      metadata,
    });
  }

  /**
   * Main entry point to run an AI Agent task asynchronously
   */
  async executeTask(taskId) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    if (task.status === 'running' || task.status === 'completed') {
      return task;
    }

    // Phase 1: Planning
    task.status = 'planning';
    task.startedAt = new Date();
    await task.save();

    await this.log(taskId, 'info', `Task received: "${task.title}"`);
    await this.log(taskId, 'info', `Initiating task reasoning & plan generation with Grok API...`);

    let plan;
    try {
      plan = await grokService.generateTaskPlan(task.title, task.description);
    } catch (err) {
      await this.log(taskId, 'error', `Failed to generate task plan: ${err.message}`);
      task.status = 'failed';
      await task.save();
      return task;
    }

    // Save plan & create step documents
    task.plan = {
      goal: plan.goal || task.title,
      summary: plan.summary || task.description,
      totalSteps: plan.steps?.length || 0,
      dependencies: plan.dependencies || [],
    };
    task.status = 'running';
    await task.save();

    // Delete any existing steps if retrying
    await TaskStep.deleteMany({ taskId });

    const stepDocs = [];
    for (const stepData of plan.steps || []) {
      const stepDoc = await TaskStep.create({
        taskId,
        order: stepData.order,
        title: stepData.title,
        description: stepData.description,
        status: 'pending',
        tool: stepData.tool || 'notes',
        input: stepData.input || {},
      });
      stepDocs.push(stepDoc);
    }

    await this.log(
      taskId,
      'info',
      `Generated structured execution plan with ${stepDocs.length} subtasks.`,
      { totalSteps: stepDocs.length, goal: plan.goal }
    );

    // Phase 2: Sequential Step Execution
    let hasFailure = false;

    for (let i = 0; i < stepDocs.length; i++) {
      // Re-check task status in case of cancellation
      const refreshedTask = await Task.findById(taskId);
      if (refreshedTask.status === 'cancelled') {
        await this.log(taskId, 'info', 'Task execution cancelled by user.');
        return refreshedTask;
      }

      const step = stepDocs[i];

      // Update step status to running
      step.status = 'running';
      step.startedAt = new Date();
      await step.save();

      await this.log(taskId, 'step_start', `Executing Step ${step.order}: ${step.title}`, {
        stepId: step._id,
        tool: step.tool,
      });

      await this.log(taskId, 'tool_call', `Invoking safety tool [${step.tool}]...`, {
        tool: step.tool,
        input: step.input,
      });

      // Artificial pacing for smooth user observation (700ms delay)
      await new Promise((resolve) => setTimeout(resolve, 700));

      // Execute tool securely via ToolManager
      const toolResult = await toolManager.executeTool(step.tool, step.input);

      if (toolResult.success !== false) {
        step.status = 'completed';
        step.output = toolResult;
        step.completedAt = new Date();
        await step.save();

        await this.log(taskId, 'tool_result', `Tool [${step.tool}] executed successfully.`, {
          tool: step.tool,
          result: toolResult,
        });
        await this.log(taskId, 'step_complete', `Step ${step.order} completed successfully.`);
      } else {
        hasFailure = true;
        step.status = 'failed';
        step.error = toolResult.error || 'Execution failed';
        step.completedAt = new Date();
        await step.save();

        await this.log(taskId, 'error', `Step ${step.order} failed: ${step.error}`, {
          stepId: step._id,
        });
      }
    }

    // Phase 3: Final Response Synthesis
    await this.log(taskId, 'info', 'Synthesizing final AI agent result...');
    
    const executedSteps = await TaskStep.find({ taskId }).sort({ order: 1 });
    const finalResultOutput = await grokService.generateFinalResult(
      task.title,
      task.description,
      executedSteps
    );

    task.result = {
      summary: plan.summary,
      output: finalResultOutput,
      completedAt: new Date(),
    };

    task.status = hasFailure ? 'failed' : 'completed';
    task.completedAt = new Date();
    await task.save();

    await this.log(
      taskId,
      'finish',
      task.status === 'completed'
        ? 'Task completed successfully! Result ready for review.'
        : 'Task execution finished with step errors.'
    );

    return task;
  }

  /**
   * Retry a single step
   */
  async retryStep(taskId, stepId) {
    const step = await TaskStep.findOne({ _id: stepId, taskId });
    if (!step) throw new Error('Step not found');

    await this.log(taskId, 'info', `Retrying Step ${step.order}: ${step.title}...`);

    step.status = 'running';
    step.retryCount = (step.retryCount || 0) + 1;
    step.startedAt = new Date();
    await step.save();

    const toolResult = await toolManager.executeTool(step.tool, step.input);

    if (toolResult.success !== false) {
      step.status = 'completed';
      step.output = toolResult;
      step.error = null;
      step.completedAt = new Date();
      await step.save();

      await this.log(taskId, 'step_complete', `Step ${step.order} retry succeeded!`);
    } else {
      step.status = 'failed';
      step.error = toolResult.error || 'Retry failed';
      step.completedAt = new Date();
      await step.save();

      await this.log(taskId, 'error', `Step ${step.order} retry failed: ${step.error}`);
    }

    return step;
  }
}

module.exports = new AgentService();
