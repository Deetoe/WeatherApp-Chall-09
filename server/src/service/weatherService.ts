import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  cityName: string;
  coordinates: Coordinates;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;

  constructor(
    cityName: string,
    coordinates: Coordinates,
    temperature: number,
    description: string,
    humidity: number,
    windSpeed: number
  ) {
    this.cityName = cityName;
    this.coordinates = coordinates;
    this.temperature = temperature;
    this.description = description;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string;
  apiKey: string;
  cityName: string;
  
  constructor(baseURL: string, apiKey: string, cityName: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.cityName = cityName;
  }


  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
  // private async fetchLocationData(query: string) {}
    const url = `${this.baseURL}?q=${query}&appid=${this.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching location data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  private destructureLocationData(locationData: any): Coordinates {
    const { coord: { lat, lon } } = locationData;
    return { lat, lon };
  }

  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  private buildGeocodeQuery(city: string): string {
    if (city) {
      return city;
    } else {
      throw new Error("City name is required to build a geocode query.");
    }
  }
  
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `lat=${lat}&lon=${lon}`;
  }
  
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const query = this.buildGeocodeQuery(city);
    const locationData = await this.fetchLocationData(query);
    const coordinates = this.destructureLocationData(locationData);
    return coordinates;
  }
  
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const query = this.buildWeatherQuery(coordinates);
    const url = `${this.baseURL}?${query}&appid=${this.apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }
  
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any): Weather {
    const { main, weather, wind, name } = response;
    const currentWeather: Weather = {
      cityName: name,
      coordinates: { lat: response.coord.lat, lon: response.coord.lon },
      temperature: main.temp,
      description: weather[0].description,
      humidity: main.humidity,
      windSpeed: wind.speed,
    };
    return currentWeather;
  }
  
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {

    return weatherData.map((forecast) => {
      return {
        cityName: currentWeather.cityName,
        coordinates: currentWeather.coordinates,
        temperature: forecast.main.temp,
        description: forecast.weather[0].description,
        humidity: forecast.main.humidity,
        windSpeed: forecast.wind.speed,
      };
    });
  }
  
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string): Promise<any> {
      const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherResponse = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherResponse);
    const forecastData = weatherResponse.list || []; 
    const forecast = this.buildForecastArray(currentWeather, forecastData);

    return { currentWeather, forecast };
  }
}

const baseURL = process.env.API_BASE_URL || '';
const apiKey = process.env.API_KEY || '';
const cityName = process.env.CITY_NAME || '';

export default new WeatherService(baseURL, apiKey, cityName);
