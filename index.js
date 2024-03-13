const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(cors());

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


// Endpoint to receive and store data
// Endpoint to receive and store data
app.post('/storeData', (req, res) => {
    const { latitude, longitude } = req.body;
    const headers = req.headers;
    const currentDate = new Date().toISOString().split('T')[0];


    // Save headers data to a file
    fs.writeFile(`./data/headers${currentDate}.json`, JSON.stringify({ headers, currentDate }), (err) => {
        if (err) throw err;
        console.log('Headers data saved successfully.');
    });

    // Save location data to a file
    const locationData = { latitude, longitude, currentDate };
    fs.writeFile(`./data/location${currentDate}.json`, JSON.stringify(locationData), (err) => {
        if (err) throw err;
        console.log('Location data saved successfully.');
    });

    console.log('Received location:', latitude);
    console.log('Received longitude:', longitude);
    res.send('ok');
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
