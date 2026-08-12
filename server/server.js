require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` 🚀 Personal AI Agent Server running on port ${PORT}`);
    console.log(` 🤖 Grok API Key status: ${process.env.GROK_API_KEY ? 'Configured' : 'Local Agent Fallback Active'}`);
    console.log(`=================================================`);
  });
});
