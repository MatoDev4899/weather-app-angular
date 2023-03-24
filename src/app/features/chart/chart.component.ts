import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize, Observable, Subject, takeUntil } from 'rxjs';
import { WeatherService } from 'src/app/core/services/weather.service';
import { DatePipe } from '@angular/common';
import { ChartData } from 'src/app/shared/models/ChartData.model';
import { CoordinatesAndDates } from 'src/app/shared/models/CoordinatesAndDates.model';
import { DateService } from 'src/app/core/services/date.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnDestroy {
  errorMessage: string;
  chartData: ChartData = new ChartData([], []);
  private componentDestroyed$: Subject<boolean> = new Subject();
  weatherDataLoading: boolean;
  haveData = false;
  invalidDate: boolean;

  constructor(
    private weatherService: WeatherService,
    private datePipe: DatePipe,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.watchForCoordinatesAndDateChanges();
  }

  get options() {
    return this.weatherService.options;
  }

  private watchForCoordinatesAndDateChanges(): void {
    this.weatherService.coordinatesSubject.asObservable().subscribe({
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
    let weatherData$: Observable<ChartData>;
    if (coordinatesAndDates) {
      weatherData$ = this.weatherService.getWeatherDataForChart(
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
        next: (chartData: ChartData) => {
          const labels: string[] = chartData.labels.map((time: string) =>
            this.datePipe.transform(time, 'shortTime')
          );
          this.chartData = new ChartData(labels, chartData.datasets);
        },
        error: (error: Error) => {
          this.errorMessage = `${error.name}. Check your connection or try refreshing the page`;
        },
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
}
