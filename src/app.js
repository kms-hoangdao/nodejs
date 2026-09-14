const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();
const compression = require('compression');
const app = express();

// init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//init db 

require('./dbs/init.mongodb');

//init routes

app.use('/', require('./routes'));

module.exports = app;