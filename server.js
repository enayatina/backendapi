const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
//const cors = require('cors');

//call router
const planning = require('./routes/planning');
const user = require('./routes/user');
const libility = require('./routes/libility');
const assumption = require('./routes/assumption');
const auth = require('./routes/auth');
const loan = require('./routes/childloan');
const cwa = require('./routes/cwa');

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

//Server static folder - public
app.use(express.static(path.join(__dirname, 'public')));
//app.use(cors);

PORT = process.env.PORT || 5000;
// const server = app.listen(
//   PORT,
//   console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
// );

//mount routes
app.use('/api/v1/planning', planning);
app.use('/api/v1/libility', libility);
app.use('/api/v1/assumption', assumption);
app.use('/api/v1/auth', auth);
app.use('/api/v1/user', user);
app.use('/api/v1/loan', loan);
app.use('/api/v1/cwa', cwa);

//middleware for error handler
app.use(errorHandler);

//handle unhandled promis
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);

  //close seerver & exit
  server.close(() => process.exit(1));
});
app.listen(PORT, '0.0.0.0', function () {
  console.log("Server started at http://128.199.115.213:%s", PORT);
});