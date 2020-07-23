const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

//load env
dotenv.config({ path: './config/config.env' });

//connect to database
connectDB();

const app = express();


app.get('/api/v1/calculators', (req, res) => {
res.send('show plan');
});

app.get('/api/v1/master', (req, res) => {
  res.send('show master plan');
  });

app.post('/api/v1/calculators', (req, res) => {
  res.send('create plan');
  });

app.put('/api/v1/calculators/:id', (req, res) => {
  res.send(`update plan with id: ${ req.params.id }`);
  });

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


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
