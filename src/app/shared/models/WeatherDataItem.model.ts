export class WeatherDataItem {
  temperature: number;
  time: string;
  humidity: number;
  wind: number;
  pressure: number;
  direction: string;
  precipitation: Object;
  cloudcover: number;
  soilTemperature: number;

  constructor(inputData: Object) {
    this.temperature = inputData['temperature'];
    this.time = inputData['time'];
    this.humidity = inputData['humidity'];
    this.wind = inputData['wind'];
    this.pressure = inputData['pressure'];
    this.direction = inputData['direction'];
    this.precipitation = inputData['precipitation'];
    this.cloudcover = inputData['cloudcover'];
    this.soilTemperature = inputData['soilTemperature'];
  }
}
