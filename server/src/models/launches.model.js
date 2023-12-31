const planets = require('./planets.mongo');
const launchesDb = require('./launches.mongo');

const DEFAULT_FLIGHT_NUMBER = 100

const launches = new Map();

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
}

saveLaunch(launch)

launches.set(launch.flightNumber, launch);

async function existsLaunchWithId(launchId) {
    return launchesDb.findOne({ flightNumber: launchId });
}

async function getAllLaunches() {
    return launchesDb.find({}, {
        _id: 0, __v: 0
    });
}

async function getLatestFlightNumber () {
    const latestLaunch = await launchesDb.findOne().sort('-flightNumber');
    if (!latestLaunch) {
        return  DEFAULT_FLIGHT_NUMBER
    }
    return latestLaunch.flightNumber;
}

async function saveLaunch (launch) {
    const planet = await planets.findOne({kepler_name: launch.target});

    if (!planet) {
        throw new Error('No matching planet was found');
    }

    await launchesDb.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    });
}

async function scheduleNewLaunch (launch) {
    const newFlightNumber = await  getLatestFlightNumber() +1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        flightNumber: newFlightNumber,
        customers: ['Zero to mastery', 'NASA']
    });

    await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
   const aborted = await launchesDb.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false
    });

   return aborted.modifiedCount === 1;
}

module.exports = {
    getAllLaunches,
    abortLaunchById,
    scheduleNewLaunch,
    existsLaunchWithId,
}
