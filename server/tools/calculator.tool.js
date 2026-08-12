/**
 * Safe Mathematical Calculator Tool
 */
const calculatorTool = {
  name: 'calculator',
  description: 'Evaluates mathematical calculations, date counts, hours distribution, or statistics safe expressions.',
  inputSchema: {
    expression: { type: 'string', required: true, description: 'Math expression e.g. "14 * 2", "100 / 14"' },
  },
  execute: async (input) => {
    try {
      const { expression } = input;
      if (!expression) {
        throw new Error('Expression parameter is required');
      }

      // Sanitize: allow only math characters, numbers, basic operators
      const sanitized = String(expression).replace(/[^0-9+\-*/().\s]/g, '');
      if (!sanitized) {
        throw new Error('Invalid characters in calculation expression');
      }

      // Safe evaluation
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${sanitized})`)();
      
      return {
        success: true,
        expression: sanitized,
        result: typeof result === 'number' ? Math.round(result * 100) / 100 : result,
        executedAt: new Date().toISOString(),
      };
    } catch (err) {
      return {
        success: false,
        error: `Calculation failed: ${err.message}`,
      };
    }
  },
};

module.exports = calculatorTool;
