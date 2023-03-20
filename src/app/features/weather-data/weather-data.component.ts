import { Component, OnInit, OnDestroy } from '@angular/core';
import { WeatherDataItem } from 'src/app/shared/models/WeatherDataItem.model';
import { WeatherService } from 'src/app/core/services/weather.service';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { CoordinatesAndDates } from 'src/app/shared/models/CoordinatesAndDates.model';
import { DatePipe } from '@angular/common';
import { DateService } from 'src/app/core/services/date.service';

@Component({
  selector: 'app-weather-data',
  templateUrl: './weather-data.component.html',
  styleUrls: ['./weather-data.component.scss'],
})
export class WeatherDataComponent implements OnInit, OnDestroy {
  filterSwitch = '';
  errorMessage: string;
  weatherData: WeatherDataItem[] = [];
  private componentDestroyed$: Subject<boolean> = new Subject();
  weatherDataLoading: boolean;
  sliderValues: number[] = [0, 100];
  haveData = false;
  invalidDate: boolean;
  filterFields: string[] = [
    'time',
    'temperature',
    'humidity',
    'wind',
    'pressure',
    'direction',
    'precipitation.didRain',
    'rain',
    'cloudcover',
    'soilTemperature',
  ];

  constructor(
    private weatherService: WeatherService,
    private datePipe: DatePipe,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.watchForCoordinatesAndDateChanges();
  }

  private watchForCoordinatesAndDateChanges(): void {
    this.weatherService.coordinatesSubject
      .asObservable()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (coordinatesAndDates: CoordinatesAndDates | null) => {
          if (!coordinatesAndDates) {
            return;
          }
          if (
            coordinatesAndDates.startDate >
              this.datePipe.transform(this.dateService.maxDate, 'yyyy-MM-dd') ||
            coordinatesAndDates.startDate <
              this.datePipe.transform(this.dateService.minDate, 'yyyy-MM-dd') ||
            coordinatesAndDates.endDate >
              this.datePipe.transform(this.dateService.maxDate, 'yyyy-MM-dd')
          ) {
            this.invalidDate = true;
            this.haveData = true;
          } else {
            this.haveData = true;
            this.invalidDate = false;
            this.getWeatherData(coordinatesAndDates);
          }
        },
      });
  }

  private getWeatherData(
    coordinatesAndDates: CoordinatesAndDates | null
  ): void {
    this.weatherDataLoading = true;
    let weatherData$: Observable<WeatherDataItem[]>;
    if (coordinatesAndDates) {
      weatherData$ = this.weatherService.getWeatherDataForTable(
        coordinatesAndDates.lat,
        coordinatesAndDates.lon,
        coordinatesAndDates.startDate,
        coordinatesAndDates.endDate
      );
    }
    weatherData$
      .pipe(
        finalize(() => (this.weatherDataLoading = false)),
        takeUntil(this.componentDestroyed$)
      )
      .subscribe({
        next: (historicalWeatherData: WeatherDataItem[]) => {
          this.weatherData = historicalWeatherData;
          this.weatherData.forEach((item: WeatherDataItem) => {
            item.direction = this.weatherService.convertWindDirection(
              parseFloat(item.direction)
            );
            item.precipitation = {
              amount: item.precipitation,
              didRain: item.precipitation > 0,
            };
          });
        },
        error: (error: Error) => {
          this.errorMessage = `${error.name}. Check your connection or try refreshing the page`;
        },
      });
  }

  get windDirections(): Object[] {
    return this.weatherService.windDirections;
  }

  clearFilters(table: Table): void {
    table.clear();
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
}
