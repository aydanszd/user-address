const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');
const notFound = require('./error/middlewares/notFound');
const errorHandler = require('./error/middlewares/errorHandler');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;