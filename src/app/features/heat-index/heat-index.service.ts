import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class HeatIndexService {
  constructor() {}

  private calculateHeatIndexInFahrenheit(
    temperature: number,
    humidity: number
  ): number {
    let result: number =
      -42.379 +
      2.04901523 * temperature +
      10.14333127 * humidity -
      0.22475541 * temperature * humidity -
      0.00683783 * temperature * temperature -
      0.05481717 * humidity * humidity +
      0.00122874 * temperature * temperature * humidity +
      0.00085282 * temperature * humidity * humidity -
      0.00000199 * temperature * temperature * humidity * humidity;
    return result;
  }

  private calculateHeatIndexInCelsius(
    temperature: number,
    humidity: number
  ): number {
    const temperatureToFahrenheit: number = (temperature * 9) / 5 + 32; // convert input to fahrenheit
    let result: number = this.calculateHeatIndexInFahrenheit(
      temperatureToFahrenheit,
      humidity
    ); // convert result to celsius
    return ((result - 32) * 5) / 9;
  }

  calculateHeatIndex(
    temperature: number,
    humidity: number,
    units: string
  ): number {
    if (units === 'C') {
      return this.calculateHeatIndexInCelsius(temperature, humidity);
    } else {
      return this.calculateHeatIndexInFahrenheit(temperature, humidity);
    }
  }

  determineComment(temperature: number, units: string): string {
    if (units === 'C') {
      temperature = (temperature * 9) / 5 + 32;
    }
    if (temperature >= 75 && temperature <= 90) {
      return 'Caution: fatigue is possible with prolonged exposure and activity. Continuing activity could result in heat cramps.';
    } else if (temperature > 90 && temperature <= 105) {
      return 'Extreme caution: heat cramps and heat exhaustion are possible. Continuing activity could result in heat stroke.';
    } else if (temperature > 105 && temperature <= 130) {
      return 'Danger: heat cramps and heat exhaustion are likely; heat stroke is probable with continued activity.';
    } else {
      return 'Extreme danger: heat stroke is imminent.';
    }
  }

  getTemperatureAndUnitValidator(selectedUnit: AbstractControl): ValidatorFn {
    return (formControl: FormControl): { [key: string]: any } => {
      const temperature: number = formControl.value;

      if (!temperature) {
        return null;
      }
      if (selectedUnit.value.code === 'F' && temperature < 80) {
        return { minTemperature: 80 };
      } else if (selectedUnit.value.code === 'C' && temperature < 26) {
        return { minTemperature: 26 };
      }
      return null;
    };
  }
}
