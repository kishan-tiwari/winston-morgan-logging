const morganBody = require("morgan-body");
const path = require('path');
const winston = require("winston");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
)

const logger = winston.createLogger({
    levels,
    format,
    transports: [
        new winston.transports.Console()
    ],
});

const loggerStream = {
    write: message => {
        logger.info(message);
    },
};

morganBody(app, { stream: loggerStream });

app.get('/hello', (req, res) => {
    res.status(200).json({
        message: "Hello World",
        statusCode: 200
    })
});

app.listen(3000, () => {
    console.log("App is running")
})
