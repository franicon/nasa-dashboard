const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const habitablePlanet = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetData () {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'src', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', (data) => {
                if (isHabitablePlanet(data)) {
                    habitablePlanet.push(data);
                }
            })
            .on("error", (err) => {
                console.log(err);
                reject(err)
            })
            .on('end', () => {
                console.log(`${habitablePlanet.length} habitable`);
                resolve();
            });
    });
}

// why are we not using emit here ?

// In the example I provided, we are actually using emit indirectly.
// In Node.js, streams are instances of the EventEmitter class, which means that they emit events. When we create a ReadStream object with fs.createReadStream, we get an instance of a Readable stream, which is also an EventEmitter. The Readable stream emits the 'data', 'end', and 'error' events that we listen for with the .on() method in the example.
// The .on() method is used to register event listeners that will be called when the specified event is emitted. When we listen for the 'data', 'end', and 'error' events with .on(), we are telling Node.js to execute the callback function we provide each time one of those events is emitted.
// So while we are not explicitly calling the emit method ourselves in this example, the Readable stream that we create with fs.createReadStream is calling emit internally to emit the 'data', 'end', and 'error' events as data is read from the file.

module.exports = {
    loadPlanetData,
    planets: habitablePlanet
}
