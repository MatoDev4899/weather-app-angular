import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WeatherDataComponent } from 'src/app/features/weather-data/weather-data.component';

const routes: Routes = [{ path: '', component: WeatherDataComponent }];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class WeatherDataModule {}
