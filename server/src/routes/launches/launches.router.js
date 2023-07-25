const express = require('express');
const { httpGetAllLaunches, httpAddNewLaunch } = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.post('/',httpAddNewLaunch );
launchesRouter.get('/', httpGetAllLaunches);
module.exports = launchesRouter;

