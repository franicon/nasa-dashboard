const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');
const { loadPlanetData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

const MONGO_URL = process.env.MONGO_URL

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('mongodb connection ready');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function startServer () {
    await mongoose.connect(MONGO_URL);
    await loadPlanetData();

    server.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
}
startServer().then(r => r);

