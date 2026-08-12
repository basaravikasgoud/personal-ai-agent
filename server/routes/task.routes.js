const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  runTaskAgent,
  cancelTaskAgent,
  getTaskSteps,
  retryTaskStep,
  getTaskLogs,
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .patch(updateTask)
  .delete(deleteTask);

router.post('/:id/run', runTaskAgent);
router.post('/:id/cancel', cancelTaskAgent);

router.get('/:id/steps', getTaskSteps);
router.post('/:id/steps/:stepId/retry', retryTaskStep);

router.get('/:id/logs', getTaskLogs);

module.exports = router;
