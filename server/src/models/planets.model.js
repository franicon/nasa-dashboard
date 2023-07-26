const fs = require('fs');
const path = require('path');
const {parse} = require('csv-parse');

const planets = require('./planents.mongo');

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'src', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    await savePlanet(data)
                }
            })
            .on("error", (err) => {
                console.log(err);
                reject(err)
            })
            .on('end', async () => {
                const countPlanetCount = (await getAllPlanets()).length
                console.log(`${countPlanetCount} habitable`);
                resolve();
            });
    });
}

async function getAllPlanets() {
   return  planets.find({}, {
       _id: 0, __v: 0
   });
}

async function savePlanet(data) {
    try {
        await planets.updateOne({
            kepler_name: data.kepler_name,
        }, {
            kepler_name: data.kepler_name,
        }, {
            upsert: true,
        });
    } catch (err) {
        console.error(`We could not save a planet ${err}`)
    }
}

module.exports = {
    loadPlanetData,
    getAllPlanets
}
