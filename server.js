const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

//load env
dotenv.config({ path: './config/config.env' });

//connect to database
connectDB();

//calling route file
const planCalculator = require('./routes/calculators/plan_calculator');
const auth = require('./routes/auth');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Mount routers
app.use('/api/v1/calculators/', planCalculator);
app.use('/api/v1/auth/', auth);

PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//handle unhandled promis
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);

  //close seerver & exit 
  server.close(() => process.exit(1));
});
