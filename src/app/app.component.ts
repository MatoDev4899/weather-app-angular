import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faTemperatureHigh,
  faClock,
  faPercent,
  faWind,
  faGem,
  faDirections,
  faWater,
  faCloud,
  faTable,
  faChartLine,
  faCalculator,
  faHome,
} from '@fortawesome/free-solid-svg-icons';
import { AuthGuard } from './core/services/auth.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private library: FaIconLibrary, private authGuard: AuthGuard) {}

  get isCitySelected(): boolean {
    return this.authGuard.isCitySelected;
  }
  ngOnInit(): void {
    this.library.addIcons(
      faTemperatureHigh,
      faClock,
      faPercent,
      faWind,
      faGem,
      faDirections,
      faWater,
      faCloud,
      faTable,
      faChartLine,
      faCalculator,
      faHome
    );
  }
}
