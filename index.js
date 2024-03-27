import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import cors from "cors";
import { fileURLToPath } from "url"; // Import fileURLToPath function from url module
import { dirname } from "path"; // Import dirname function from path module
import systeminformation from 'systeminformation';
import { getAllHistory } from "node-browser-history";
const __filename = fileURLToPath(import.meta.url); // Convert the import meta URL to a file path
const __dirname = dirname(__filename); // Get the directory name
import find from 'local-devices'


const app = express();
const PORT = 3000;

getAllHistory(10).then(function (history) {
    //console.log(history);
});


// Find all local network devices.
find().then(devices => {
    console.log(devices) /*
    [
      { name: '?', ip: '192.168.0.10', mac: '...' },
      { name: '...', ip: '192.168.0.17', mac: '...' },
      { name: '...', ip: '192.168.0.21', mac: '...' },
      { name: '...', ip: '192.168.0.22', mac: '...' }
    ]
    */
})
find({ skipNameResolution: true }).then(devices => {
    console.log(devices) /*
    [
      { name: '?', ip: '192.168.0.10', mac: '...' },
      { name: '?', ip: '192.168.0.50', mac: '...' },
      { name: '?', ip: '192.168.0.155', mac: '...' },
      { name: '?', ip: '192.168.0.211', mac: '...' }
    ]
    */
})

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


const hardwareInfo = async () => {
    try {
        // Get CPU information
        const cpuData = await systeminformation.cpu();
        console.log('CPU Information:');
        console.log(cpuData);

        // Get memory information
        const memData = await systeminformation.mem();
        console.log('\nMemory Information:');
        console.log(memData);

        // Get graphics card information
        const gpuData = await systeminformation.graphics();
        console.log('\nGraphics Card Information:');
        console.log(gpuData);

        // Get disk information
        const diskData = await systeminformation.diskLayout();
        console.log('\nDisk Information:');
        console.log(diskData);

        // Get network interface information
        const netData = await systeminformation.networkInterfaces();
        console.log('\nNetwork Interface Information:');
        console.log(netData);

        // Get battery information (if applicable)
        const batteryData = await systeminformation.battery();
        if (batteryData.hasbattery) {
            console.log('\nBattery Information:');
            console.log(batteryData);
        } else {
            console.log('\nBattery Information: No battery detected');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



// Endpoint to receive and store data
app.post('/storeData', async (req, res) => {
    const { latitude, longitude } = req.body;
    const headers = req.headers;
    const currentDate = new Date();
    const currentDateFormatted = `${currentDate.getFullYear()}-${padWithZero(currentDate.getMonth() + 1)}-${padWithZero(currentDate.getDate())}`;
    const currentTimeFormatted = `${padWithZero(currentDate.getHours())}-${padWithZero(currentDate.getMinutes())}-${padWithZero(currentDate.getSeconds())}`;
    const currentDateTime = `${currentDateFormatted}-${currentTimeFormatted}`;


    hardwareInfo();
    // Save headers data to a file
    fs.writeFile(`${__dirname}/public/data/headers-${currentDateTime}.json`, JSON.stringify({ headers, currentDateTime }), (err) => {
        if (err) throw err;
        console.log('Headers data saved successfully.');
    });

    // Save location data to a file
    fs.writeFile(`${__dirname}/public/data/location-${currentDateTime}.json`, JSON.stringify({ latitude, longitude, currentDateTime }), (err) => {
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
