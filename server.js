const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

//call router
const planning = require('./routes/planning');
const libility = require('./routes/libility');
const auth = require('./routes/auth');

const { json } = require('express');

//load env
dotenv.config({ path: './config/config.env' });

//connect to database
connectDB();

const app = express();

app.use(express.json());

//dev logging middleware with morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//mount routes
app.use('/api/v1/planning', planning);
app.use('/api/v1/libility', libility);
app.use('/api/v1/auth', auth);

//middleware for error handler
app.use(errorHandler);

//handle unhandled promis
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);

  //close seerver & exit
  server.close(() => process.exit(1));
});
