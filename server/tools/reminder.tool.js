/**
 * Schedule & Reminders Manager Tool
 */
const reminderTool = {
  name: 'reminder',
  description: 'Creates daily milestone reminders, revision timers, and schedule blocks.',
  inputSchema: {
    label: { type: 'string', required: true },
    timeframe: { type: 'string', required: true, description: 'e.g. "Daily at 9:00 AM" or "Day 1 to 14"' },
  },
  execute: async (input) => {
    try {
      const { label, timeframe } = input;
      if (!label || !timeframe) throw new Error('Label and timeframe are required');

      return {
        success: true,
        reminderId: `rem_${Date.now()}`,
        label,
        timeframe,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      };
    } catch (err) {
      return {
        success: false,
        error: `Reminder tool error: ${err.message}`,
      };
    }
  },
};

module.exports = reminderTool;
