const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const port = process.env.PORT | 5000;

// Setting up express
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Handling errors
app.use(errorHandler);

// Connecting to the database
connectDB();

// Routes
app.use("/api/member", require("./routes/memberRoute"));
app.use("/api/trainer", require("./routes/trainerRoute"));
app.use("/api/plan", require("./routes/planRoute"));

// Setting up the port to listen to my server
app.listen(port, () => {
    console.log(`Server started at port ${port}`)
});