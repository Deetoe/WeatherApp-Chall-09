import fs from 'fs';

// TODO: Define a City class with name and id properties
class City {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = '../../db/db.json'; // ADJUST PASTH AS NEEDED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  }

  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  private async read(): Promise<City[]> {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error instanceof Error && (error as any).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf-8');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error writing to file: ${error.message}`);
      }
      throw new Error('Unknown error occurred while writing to file');
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  async getCities(): Promise<City[]> {
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  async addCity(city: string): Promise<void> {
    const cities = await this.read();
    const newCity: City = {
      id: Date.now(), // Using current timestamp as unique ID
      name: city,
    };
    cities.push(newCity);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter(city => city.id !== parseInt(id)); // Assuming `id` is numeric
    await this.write(updatedCities);
  }
}

export default new HistoryService();
