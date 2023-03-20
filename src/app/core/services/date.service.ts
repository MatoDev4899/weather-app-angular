import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { WeatherService } from 'src/app/core/services/weather.service';
import { City } from 'src/app/shared/models/City.model';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  maxDate: Date = new Date();
  minDate: Date = new Date();
  isLatestDate: boolean;
  isEarliestDate: boolean;
  constructor(
    private weatherService: WeatherService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.minDate.setDate(this.minDate.getDate() - 18250);
    this.maxDate.setDate(this.maxDate.getDate() - 8);
  }

  watchForStoredDate(): void {
    const cityString: string = localStorage.getItem('city');
    const startDate: string = sessionStorage.getItem('startDate');
    const endDate: string = sessionStorage.getItem('endDate');
    const city: City = JSON.parse(cityString);
    const lat: string = city.lat.toString();
    const lon: string = city.lon.toString();
    if (startDate !== null || endDate !== null) {
      this.weatherService.coordinatesSubject.next({
        lat: lat,
        lon: lon,
        startDate: startDate,
        endDate: endDate,
      });
    } else {
      this.weatherService.coordinatesSubject.next(null);
    }
  }

  previousPeriod(form: FormGroup): void {
    this.isLatestDate = false;
    const lat: string = form.controls['selectedCity'].value.lat;
    const lon: string = form.controls['selectedCity'].value.lon;
    const selectedDates: Date = form.controls['selectedDates'].value;
    let startDate: Date = selectedDates[0];
    let endDate: Date = selectedDates[1];
    const rangeInDays: number =
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;
    startDate = new Date(startDate.setDate(startDate.getDate() - rangeInDays));
    endDate = new Date(endDate.setDate(endDate.getDate() - rangeInDays));
    if (startDate < this.minDate || endDate < this.minDate) {
      this.isEarliestDate = true;
      return;
    }
    form.controls['selectedDates'].setValue([startDate, endDate]);
    this.weatherService.coordinatesSubject.next({
      lat: lat,
      lon: lon,
      startDate: this.datePipe.transform(startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(endDate, 'yyyy-MM-dd'),
    });
  }

  nextPeriod(form: FormGroup): void {
    this.isEarliestDate = false;
    const lat: string = form.controls['selectedCity'].value.lat;
    const lon: string = form.controls['selectedCity'].value.lon;
    const selectedDates: Date = form.controls['selectedDates'].value;
    let startDate: Date = selectedDates[0];
    let endDate: Date = selectedDates[1];
    const rangeInDays: number =
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;
    startDate = new Date(startDate.setDate(startDate.getDate() + rangeInDays));
    endDate = new Date(endDate.setDate(endDate.getDate() + rangeInDays));
    if (startDate > this.maxDate || endDate > this.maxDate) {
      this.isLatestDate = true;
      return;
    }
    form.controls['selectedDates'].setValue([startDate, endDate]);
    this.weatherService.coordinatesSubject.next({
      lat: lat,
      lon: lon,
      startDate: this.datePipe.transform(startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(endDate, 'yyyy-MM-dd'),
    });
  }

  submitDates(form: FormGroup): void {
    const startDate: string = this.datePipe.transform(
      form.controls['selectedDates'].value[0],
      'yyyy-MM-dd'
    );
    const endDate: string = this.datePipe.transform(
      form.controls['selectedDates'].value[1],
      'yyyy-MM-dd'
    );
    sessionStorage.setItem('startDate', startDate);
    sessionStorage.setItem('endDate', endDate);
    if (
      !form.controls['selectedCity'].value ||
      !form.controls['selectedDates'].value[1]
    ) {
      return;
    }
    if (this.router.url === '/weather-data') {
      this.refreshRoute('/weather-data');
    } else {
      this.refreshRoute('/chart');
    }
    this.isLatestDate = false;
    this.isEarliestDate = false;
    const lat: string = form.controls['selectedCity'].value.lat;
    const lon: string = form.controls['selectedCity'].value.lon;
    localStorage.setItem(
      'city',
      JSON.stringify(form.controls['selectedCity'].value)
    );
    this.weatherService.coordinatesSubject.next({
      lat: lat,
      lon: lon,
      startDate: startDate,
      endDate: endDate,
    });
  }

  private refreshRoute(url: string): void {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([url]));
  }
}
