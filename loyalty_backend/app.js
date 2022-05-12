const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
require('dotenv').config();

const indexRouter = require('./routes');
// initialize our express app
const app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
module.exports = app;
