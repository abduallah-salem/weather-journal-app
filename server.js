// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 3000;
const server = app.listen(port, () => {
    console.log(`running on localhost: ${port}`);
})

//routes
//get route send the current data in the projectData end point
app.get('/all', (req, res) => {
    res.send(projectData);
});

//newEntry post route
app.post('/newEntry', (req, res) => {
    //validate the incoming data and return error if any is not found
    if (!req.body.temprature || !req.body.date || !req.body.userResponse) {
        return res.status(400).send({
            message: "Missing entries"
        });
    }
    //Assign data to the project end point
    projectData.temprature = req.body.temprature;
    projectData.date = req.body.date;
    projectData.userResponse = req.body.userResponse;
    console.log(projectData);
    //send confirmation to client that the entry was received
    res.send({message: 'Entry received'});
})