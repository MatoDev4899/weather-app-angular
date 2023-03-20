import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { AuthGuard } from './core/services/auth.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'weather-data',
    loadChildren: () =>
      import('./modules/weather-data.module').then((m) => m.WeatherDataModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'chart',
    loadChildren: () =>
      import('./modules/chart.module').then((m) => m.ChartModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'heat-index',
    loadChildren: () =>
      import('./modules/heat-index.module').then((m) => m.HeatIndexModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home.module').then((m) => m.HomeModule),
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(appRoutes)],
})
export class AppRoutingModule {}
