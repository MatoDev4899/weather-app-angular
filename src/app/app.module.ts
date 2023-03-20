import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { RouterModule } from '@angular/router';
import { SliderModule } from 'primeng/slider';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';

import { AppComponent } from './app.component';
import { WeatherDataComponent } from './features/weather-data/weather-data.component';
import { ChartComponent } from './features/chart/chart.component';
import { HeatIndexComponent } from './features/heat-index/heat-index.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { HomeComponent } from './features/home/home.component';
import { AuthGuard } from './core/services/auth.guard';
import { UserInputComponent } from './features/user-input/user-input.component';
import { WeatherService } from './core/services/weather.service';

@NgModule({
  declarations: [
    AppComponent,
    WeatherDataComponent,
    ChartComponent,
    HeatIndexComponent,
    PageNotFoundComponent,
    HomeComponent,
    UserInputComponent,
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    ChartModule,
    TableModule,
    HttpClientModule,
    InputTextModule,
    FormsModule,
    SelectButtonModule,
    DropdownModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    InputSwitchModule,
    PaginatorModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    MultiSelectModule,
    SliderModule,
    CalendarModule,
    TooltipModule,
  ],
  providers: [DatePipe, WeatherService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {}
}
