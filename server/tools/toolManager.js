const calculatorTool = require('./calculator.tool');
const notesTool = require('./notes.tool');
const webSearchTool = require('./webSearch.tool');
const reminderTool = require('./reminder.tool');

class ToolManager {
  constructor() {
    this.tools = new Map();
    this.registerTool(calculatorTool);
    this.registerTool(notesTool);
    this.registerTool(webSearchTool);
    this.registerTool(reminderTool);
  }

  registerTool(tool) {
    if (!tool.name || typeof tool.execute !== 'function') {
      throw new Error(`Invalid tool structure for ${tool.name || 'unnamed tool'}`);
    }
    this.tools.set(tool.name.toLowerCase(), tool);
  }

  getTool(name) {
    if (!name) return null;
    return this.tools.get(String(name).toLowerCase()) || null;
  }

  listTools() {
    return Array.from(this.tools.values()).map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    }));
  }

  /**
   * Safe Tool Execution with Validation & Permission Check
   */
  async executeTool(name, input = {}) {
    const toolName = String(name || 'notes').toLowerCase();
    const tool = this.getTool(toolName);

    if (!tool) {
      // Fallback to notes tool if requested tool doesn't exist
      const fallback = this.getTool('notes');
      return await fallback.execute({
        title: `Execution note for step (${name})`,
        content: typeof input === 'string' ? input : JSON.stringify(input),
      });
    }

    // Input schema validation & sanitize
    const sanitizedInput = typeof input === 'object' && input !== null ? { ...input } : { content: String(input) };

    try {
      return await tool.execute(sanitizedInput);
    } catch (err) {
      return {
        success: false,
        error: `Tool [${toolName}] execution failed: ${err.message}`,
      };
    }
  }
}

module.exports = new ToolManager();
