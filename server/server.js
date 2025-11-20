const express = require('express');
const cors = require('cors');
const path = require('path');

const chatRoutes = require('./routes/chat');
const schemesRoutes = require('./routes/schemes');
const hospitalsRoutes = require('./routes/hospitals');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/hospitals', hospitalsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SwastyaSaathi server listening on port ${PORT}`);
});

module.exports = app;
