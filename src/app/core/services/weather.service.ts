import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { WeatherData } from 'src/app/shared/models/WeatherData.model';
import { WeatherDataItem } from 'src/app/shared/models/WeatherDataItem.model';
import { Dataset } from 'src/app/shared/models/Dataset.model';
import { ChartData } from 'src/app/shared/models/ChartData.model';
import { ChartLabel } from 'src/app/shared/models/ChartLabel.model';
import { CoordinatesAndDates } from 'src/app/shared/models/CoordinatesAndDates.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  windDirections: Object[] = [
    { direction: 'N' },
    { direction: 'NE' },
    { direction: 'NW' },
    { direction: 'S' },
    { direction: 'SW' },
    { direction: 'SE' },
    { direction: 'E' },
    { direction: 'W' },
  ];
  options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            let unit: string;
            if (tooltipItem.dataset.label === 'Temperature') {
              unit = '°C';
            } else if (tooltipItem.dataset.label === 'Humidity') {
              unit = '%';
            } else unit = 'km/h';
            return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}${unit}`;
          },
        },
      },
    },
  };

  constructor(private http: HttpClient) {}

  coordinatesSubject: BehaviorSubject<CoordinatesAndDates | null> =
    new BehaviorSubject<CoordinatesAndDates | null>(null);

  private getWeatherData(
    lat?: string,
    lon?: string,
    startDate?: string,
    endDate?: string
  ) {
    return this.http.get<WeatherData>(
      `https://archive-api.open-meteo.com/v1/era5?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,surface_pressure,precipitation,rain,cloudcover,windspeed_10m,winddirection_10m,soil_temperature_0_to_7cm&timezone=Europe%2FLondon`
    );
  }

  getWeatherDataForTable(
    lat?: string,
    lon?: string,
    starDate?: string,
    endDate?: string
  ): Observable<WeatherDataItem[]> {
    return this.getWeatherData(lat, lon, starDate, endDate).pipe(
      map((historicalWeatherData: WeatherData) => {
        const weatherData: WeatherDataItem[] = [];
        historicalWeatherData.hourly['temperature_2m'].forEach(
          (value: string, i: number) => {
            weatherData.push(
              new WeatherDataItem({
                temperature: value,
                time: historicalWeatherData.hourly['time'][i],
                humidity:
                  historicalWeatherData.hourly['relativehumidity_2m'][i],
                wind: historicalWeatherData.hourly['windspeed_10m'][i],
                pressure: historicalWeatherData.hourly['surface_pressure'][i],
                direction: historicalWeatherData.hourly['winddirection_10m'][i],
                precipitation: historicalWeatherData.hourly['precipitation'][i],
                cloudcover: historicalWeatherData.hourly['cloudcover'][i],
                soilTemperature:
                  historicalWeatherData.hourly['soil_temperature_0_to_7cm'][i],
              })
            );
          }
        );
        return weatherData;
      })
    );
  }

  getWeatherDataForChart(
    lat?: string,
    lon?: string,
    startDate?: string,
    endDate?: string
  ): Observable<ChartData> {
    return this.getWeatherData(lat, lon, startDate, endDate).pipe(
      map((historicalWeatherData: WeatherData) => {
        const data: WeatherDataItem[] = [];
        historicalWeatherData.hourly['temperature_2m'].forEach((value, i) => {
          data.push(
            new WeatherDataItem({
              temperature: value,
              time: historicalWeatherData.hourly['time'][i],
              humidity: historicalWeatherData.hourly['relativehumidity_2m'][i],
              wind: historicalWeatherData.hourly['windspeed_10m'][i],
            })
          );
        });
        const labels: string[] = data.map((item: ChartLabel) => item.time);
        const datasets: Dataset[] = [
          new Dataset(
            'Temperature',
            data.map((item: ChartLabel) => item.temperature),
            false,
            '#42A5F5',
            0.4
          ),
          new Dataset(
            'Humidity',
            data.map((item: ChartLabel) => item.humidity),
            false,
            '#FFA500',
            0.4,
            true
          ),
          new Dataset(
            'Wind Speed',
            data.map((item: ChartLabel) => item.wind),
            false,
            '#FF0000',
            0.4,
            true
          ),
        ];

        return new ChartData(labels, datasets);
      })
    );
  }

  convertWindDirection(value: number): string {
    if (value >= 0 && value <= 22) {
      return 'N';
    } else if (value > 22 && value <= 67) {
      return 'NE';
    } else if (value > 67 && value <= 112) {
      return 'E';
    } else if (value > 112 && value <= 157) {
      return 'SE';
    } else if (value > 157 && value <= 202) {
      return 'S';
    } else if (value > 202 && value <= 247) {
      return 'SW';
    } else if (value > 247 && value <= 292) {
      return 'W';
    } else if (value > 292 && value <= 337) {
      return 'NW';
    }
    return 'N';
  }
}
