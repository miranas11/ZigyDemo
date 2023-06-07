const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');



const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");


const options = {
    definition:{
        openapi: '3.0.0',
        info: {
            title: 'Real Time data update using Sockets',
            version: '1.0.0',
            description: 'API documentation for a simple Socket.IO app',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec));

server.listen(3000, () => {
    console.log("SERVER STARTED ON 3000");
});

io.on("connection", (socket) => {
    console.log("Server connected");
    socket.on("data sent", (data) => {
        // Broadcast text change
        io.sockets.emit("data updated", data);
    });
    socket.on("checkbox sent", (data) => {
        // Broadcast checkbox change
        io.sockets.emit("checkbox updated", data);
    });
});

/**
 * @swagger
 * /:
 *  get:
 *      summary: Returns the home page
 *      responses:
 *          200
 */


app.get('/',(req,res)=>{
    res.render('home');
})

/**
 * @swagger
 * /1:
 *  get:
 *      summary: Returns the input page
 *      responses:
 *          200
 */

app.get("/1", (req, res) => {
    res.render("1");
});

/**
 * @swagger
 * /2:
 *  get:
 *      summary: Returns the output page
 *      responses:
 *          200
 */

app.get("/2", (req, res) => {
    res.render("2");
});
