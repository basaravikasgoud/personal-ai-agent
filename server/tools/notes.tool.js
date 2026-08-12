/**
 * Structured Notes & Plan Organizer Tool
 */
const notesTool = {
  name: 'notes',
  description: 'Creates formatted markdown notes, topic breakdowns, bullet lists, or study session cards.',
  inputSchema: {
    title: { type: 'string', required: true },
    content: { type: 'string', required: true },
    category: { type: 'string', required: false, default: 'General' },
  },
  execute: async (input) => {
    try {
      const { title, content, category = 'General' } = input;
      
      const formattedNote = `### 📝 ${title}\n**Category:** ${category}\n\n${content}`;
      
      return {
        success: true,
        title,
        category,
        content,
        formattedNote,
        createdAt: new Date().toISOString(),
      };
    } catch (err) {
      return {
        success: false,
        error: `Notes tool error: ${err.message}`,
      };
    }
  },
};

module.exports = notesTool;
