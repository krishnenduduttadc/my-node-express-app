const express = require('express');
const axios = require('axios'); // Import axios for making HTTP requests
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the Weather App!</h1>
        <p>Use <code>/weather?latitude={lat}&longitude={lon}</code> to get weather data.</p>
    `);
});

app.get('/weather', async (req, res) => {
    const { latitude, longitude } = req.query;

    // Validate query parameters
    if (!latitude || !longitude) {
        return res.status(400).send(`
            <h2>Error</h2>
            <p>Please provide latitude and longitude as query parameters.</p>
        `);
    }

    try {
        // Fetch weather data from Open-Meteo API
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
                latitude: latitude,
                longitude: longitude,
                current_weather: true, // Get current weather
            },
        });

        const weather = response.data.current_weather;

        // Render the weather data in an HTML table with enhanced CSS styles
        res.send(`
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f0f8ff;
                    color: #333;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    min-height: 100vh;
                }
                h1, h2 {
                    color: #4CAF50;
                    margin-bottom: 10px;
                }
                table {
                    width: 60%;
                    margin: 20px 0;
                    border-collapse: collapse;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                    overflow: hidden;
                    background: white;
                }
                th, td {
                    padding: 15px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #4CAF50;
                    color: white;
                    font-weight: bold;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                tr:hover {
                    background-color: #e2f0e9;
                }
                a {
                    color: #4CAF50;
                    text-decoration: none;
                    font-weight: bold;
                    margin-top: 20px;
                }
                a:hover {
                    text-decoration: underline;
                }
                .container {
                    max-width: 800px;
                    margin: auto;
                    padding: 20px;
                    background: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }
            </style>
            <div class="container">
                <h2>Weather Data</h2>
                <table>
                    <tr>
                        <th>Latitude</th>
                        <td>${response.data.latitude}</td>
                    </tr>
                    <tr>
                        <th>Longitude</th>
                        <td>${response.data.longitude}</td>
                    </tr>
                    <tr>
                        <th>Temperature (°C)</th>
                        <td>${weather.temperature}</td>
                    </tr>
                    <tr>
                        <th>Windspeed (km/h)</th>
                        <td>${weather.windspeed}</td>
                    </tr>
                    <tr>
                        <th>Wind Direction (°)</th>
                        <td>${weather.winddirection}</td>
                    </tr>
                    <tr>
                        <th>Weather Code</th>
                        <td>${weather.weathercode}</td>
                    </tr>
                    <tr>
                        <th>Is Day?</th>
                        <td>${weather.is_day ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                        <th>Time</th>
                        <td>${weather.time}</td>
                    </tr>
                </table>
                <a href="/">Go back to Home</a>
            </div>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send(`
            <h2>Error</h2>
            <p>Failed to fetch weather data. Please try again later.</p>
        `);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

