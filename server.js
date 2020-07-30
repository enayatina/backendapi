const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

//call router
const planning = require('./routes/planning');

//load env
dotenv.config({ path: './config/config.env' });

//connect to database
connectDB();

const app = express();

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

//handle unhandled promis
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);

  //close seerver & exit
  server.close(() => process.exit(1));
});
