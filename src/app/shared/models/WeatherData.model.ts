import { HourlyWeather } from './HourlyWeather.model';
export class WeatherData {
  constructor(
    public latitude: number,
    public longitude: number,
    public generationTime: number,
    public utcOffsetSeconds: number,
    public timezone: string,
    public timezoneAbbreviation: string,
    public elevation: number,
    public hourly: HourlyWeather
  ) {}
}
