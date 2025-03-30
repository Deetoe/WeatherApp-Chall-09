import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService'; // Correct import for TypeScript
import WeatherService from '../../service/weatherService'; // Correct import for TypeScript

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { location } = req.body; // Extract the city name from the request body

  if (!location) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // Get weather data from the WeatherService
    const weatherData = await WeatherService.getWeatherForCity(location);

    // Save city to search history
    await HistoryService.addCity(location);

    return res.json(weatherData); // Return the weather data
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// TODO: GET search history
router.get('/history', async (_, res) => {
  try {
    const cities = await HistoryService.getCities();
    return res.json({ cities });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'City ID is required to remove from history' });
  }

  try {
    // Remove city from search history using HistoryService
    await HistoryService.removeCity(id);
    return res.status(200).json({ message: 'City removed from search history' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to remove city from history' });
  }
});

export default router;
