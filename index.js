import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import cors from "cors";
import { fileURLToPath } from "url"; // Import fileURLToPath function from url module
import { dirname } from "path"; // Import dirname function from path module

const __filename = fileURLToPath(import.meta.url); // Convert the import meta URL to a file path
const __dirname = dirname(__filename); // Get the directory name

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
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
// Function to pad single-digit numbers with leading zeros
function padWithZero(number) {
    return (number < 10 ? '0' : '') + number;
}
// Endpoint to receive and store data
app.post('/storeData', async (req, res) => {
    const { latitude, longitude } = req.body;
    const headers = req.headers;
    const currentDate = new Date();
    const currentDateFormatted = `${currentDate.getFullYear()}-${padWithZero(currentDate.getMonth() + 1)}-${padWithZero(currentDate.getDate())}`;
    const currentTimeFormatted = `${padWithZero(currentDate.getHours())}-${padWithZero(currentDate.getMinutes())}-${padWithZero(currentDate.getSeconds())}`;
    const currentDateTime = `${currentDateFormatted}-${currentTimeFormatted}`;

    // Save headers data to a file
    fs.writeFile(`${__dirname}/data/headers-${currentDateTime}.json`, JSON.stringify({ headers, currentDateTime }), (err) => {
        if (err) throw err;
        console.log('Headers data saved successfully.');
    });

    // Save location data to a file
    fs.writeFile(`${__dirname}/data/location-${currentDateTime}.json`, JSON.stringify({ latitude, longitude, currentDateTime }), (err) => {
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
