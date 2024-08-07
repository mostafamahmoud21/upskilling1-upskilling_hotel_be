const express = require('express');
const dotenv = require('dotenv').config()
const cors = require('cors');
const sequelize = require('./config/DataBase.js');
const authRouter = require('./routes/authRoutes.js');
const helmet = require("helmet");
const useragent = require("express-useragent");
const path = require("path");
const morgan = require('morgan');
const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express());
app.use(helmet());

app.use(
    cors({
        origin: function (origin, callback) {
            callback(null, true);
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin", "language", "ngrok-skip-browser-warning"],
        exposedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin", "language", "ngrok-skip-browser-warning"],
        optionsSuccessStatus: 200,
    })
);

app.use('/auth', authRouter)

app.get('/', (req, res) => {
    res.json({ message: 'Hello' });
});


app.listen(process.env.PORT, () => console.log('Server running...'));
