const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const planetsRouter = require('./routes/planents/planets.router');
const launchesRouter = require("./routes/launches/launches.router");

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL
}));
app.use(morgan('combined'));

app.use(express.json());
app.use('/planets', planetsRouter);
app.use('/launches', launchesRouter);

module.exports = app
