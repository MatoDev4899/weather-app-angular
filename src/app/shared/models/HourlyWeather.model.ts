export class HourlyWeather {
  public time: string[];
  public temperature: number[];
  public relativeHumidity: number[];
  public dewpoint: number[];
  public apparentTemperature: number[];
  public surfacePressure: number[];
  public precipitation: number[];
  public rain: number[];
  public cloudcover: number[];
  public windSpeed: number[];
  public windDirection: number[];
  public soilTemperature: number[];

  constructor(rawData: Object) {
    this.time = rawData['time'];
    this.temperature = rawData['temperature_2m'];
    this.relativeHumidity = rawData['relativehumidity_2m'];
    this.dewpoint = rawData['windspeed_10m'];
    this.apparentTemperature = rawData['surface_pressure'];
    this.surfacePressure = rawData['winddirection_10m'];
    this.precipitation = rawData['precipitation'];
    this.rain = rawData['rain'];
    this.cloudcover = rawData['cloudcover'];
    this.windSpeed = rawData['windspeed_10m'];
    this.windDirection = rawData['winddirection_10m'];
    this.soilTemperature = rawData['soil_temperature_0_to_7cm'];
  }
}
