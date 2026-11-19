const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require('dotenv').config();

const app = require('./src/app');
const mongoose = require('mongoose');

console.log('Mongo URI loaded:', !!process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Database connected successfully');

        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((error) => {
        console.log('Database connection failed:', error.message);
    });