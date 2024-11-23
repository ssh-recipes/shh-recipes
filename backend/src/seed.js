const { config } = require('dotenv');
config({ path: '.env.local' });

const db = require('./db');

const seed = async () => {
    console.log("Seeding");
};

seed();
