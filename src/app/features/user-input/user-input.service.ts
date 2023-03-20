import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { WeatherService } from 'src/app/core/services/weather.service';
import { City } from 'src/app/shared/models/City.model';

@Injectable({
  providedIn: 'root',
})
export class UserInputService {
  constructor(
    private weatherService: WeatherService,
    private datePipe: DatePipe
  ) {}

  setStoredCityAndDate(city: AbstractControl, date: AbstractControl): void {
    city.setValue(JSON.parse(localStorage.getItem('city')));
    if (
      sessionStorage.getItem('startDate') &&
      sessionStorage.getItem('endDate')
    ) {
      date.setValue([
        new Date(
          this.datePipe.transform(
            sessionStorage.getItem('startDate'),
            'MM/dd/yyyy'
          )
        ),
        new Date(
          this.datePipe.transform(
            sessionStorage.getItem('endDate'),
            'MM/dd/yyyy'
          )
        ),
      ]);
    }
  }

  onCityChange(city: AbstractControl, date: AbstractControl): void {
    city.valueChanges.subscribe((item: City) => {
      localStorage.setItem('city', JSON.stringify(city.value));
      if (date.value[1]) {
        this.weatherService.coordinatesSubject.next({
          lat: item.lat,
          lon: item.lon,
          startDate: this.datePipe.transform(date.value[0], 'yyyy-MM-dd'),
          endDate: this.datePipe.transform(date.value[1], 'yyyy-MM-dd'),
        });
      }
    });
  }
}
