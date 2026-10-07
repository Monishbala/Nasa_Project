const http = require('http');
require("dotenv").config();
const app = require("./app");

const { mongoConnect } = require('./services/mongo');

const { loadPlanetsData } = require('./models/planets.model')

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;


async function startServer() {
    await mongoConnect();
    await loadPlanetsData();

    server.listen(PORT, (req, res) => {
        console.log(`Listening on port ${PORT}`)
    })
}

startServer();










