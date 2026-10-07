const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planets = require("./planets.mongo");

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

async function loadPlanetsData() {
    const parser = fs.createReadStream(
        path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    ).pipe(parse({
        comment: '#',
        columns: true,
    }));
    let savedCount = 0;

    for await (const data of parser) {
        if (isHabitablePlanet(data) && await savePlanet(data)) {
            savedCount += 1;
        }
    }

    console.log(`${savedCount} habitable planets saved!`);
}


async function getAllPlanets() {
    return await planets.find({},
        {
            '__v': 0,
            '_id': 0
        }
    );
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert: true,
        });
        return true;
    }
    catch (err) {
        console.log(`Could not save planet ${err}`);
        return false;
    }

}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
};