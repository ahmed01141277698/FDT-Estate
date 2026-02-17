const express = require('express')
const mongoose = require('mongoose');
const app = express()
const connectLivereload = require("connect-livereload");
const dataEsta = require('./data/Shema');
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
const port = process.env.PORT || 3000
const dotenv = require('dotenv');
// Live Reload Setup  
dotenv.config();

liveReloadServer.watch(path.join(__dirname, 'public'));
app.use(connectLivereload());
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});


console.log(dataEsta);
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));



// Connecting to MongoDB and starting the server
mongoose.connect(process.env.Mongo).then(() => {

    app.listen(port, () => {
        console.log(`http://localhost:${port}`)
        console.log('Connected to MongoDB');    
    })
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});