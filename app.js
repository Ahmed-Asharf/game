const express = require('express');
const cors = require('cors');
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');
const gameRouter = require('./routes/gameRoutes');
const tourRouter = require('./routes/tourRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/Games', gameRouter);
app.use('/api/tournaments', tourRouter);

module.exports = app;
