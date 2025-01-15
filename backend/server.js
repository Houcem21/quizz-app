require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./src/config/database");
const questionRoutes = require("./src/routes/questionRoutes");
const {setupWebSocket} = require("./src/socket/socketServer");

//Create a Server
const app = express();
const PORT = process.env.PORT || 5000;

//Set up Middleware with cors, parsing
app.use(cors());
app.use(bodyParser.json());
app.use("/api/questions", questionRoutes);

//Connect to MongoDB
connectDB();

//Test a route
app.get("/", (req, res) => {
    res.send("Backend is running here!")
});

//Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
})

//Set up Web socket for multiplayer
setupWebSocket(server);