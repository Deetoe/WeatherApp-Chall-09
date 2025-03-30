import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import routes from './routes/index.js';  // Assuming you have other routes in a separate file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Middleware to serve static files (adjust path to your client build directory)
app.use(express.static(path.join(__dirname, 'client'))); // Adjust path to where your built assets are located

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implement routes
app.use(routes);

// Route to serve the index.html
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));  // Serve index.html from the client folder
});

// Route to get the search history (GET /api/weather/history)
app.get('/api/weather/history', (_, res) => {
  const filePath = path.join(__dirname, 'data', 'searchHistory.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read search history.' });
    }

    try {
      const searchHistory = JSON.parse(data || '[]');
      return res.json(searchHistory);
    } catch (parseError) {
      return res.status(500).json({ error: 'Failed to parse search history.' });
    }
  });
});

// Route to add a new city and fetch its weather data (POST /api/weather)
app.post('/api/weather', (req, res) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ error: 'City name is required.' });
  }

  try {
    // Add logic to fetch weather data and handle other cases
    // For now, return a placeholder response
    return res.status(200).json({ message: `Weather data for ${cityName} will be fetched.` });
  } catch (error) {
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});
