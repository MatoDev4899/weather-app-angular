import { Component, OnInit, AfterViewInit } from '@angular/core';
import { City } from 'src/app/shared/models/City.model';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { AuthGuard } from 'src/app/core/services/auth.guard';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  cities: City[];
  markers: [string, number, number][];
  private map: L.Map;

  constructor(private router: Router, private authGuard: AuthGuard) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnInit(): void {
    this.markers = [
      ['London', 51.51, -0.13],
      ['Sydney', -33.87, 151.21],
      ['New York', 40.71, -74.01],
      ['Paris', 48.85, 2.35],
      ['Tokyo', 35.69, 139.69],
      ['Bratislava', 48.15, 17.11],
    ];
  }

  private initMap(): void {
    const mapLocationMarker: L.Icon<L.IconOptions> = L.icon({
      iconUrl: 'marker-icon.png',
      iconSize: [30, 45],
      iconAnchor: [16, 45],
    });

    this.map = L.map('map', {
      center: [39.8282, -8.5795],
      zoom: 2,
      maxBounds: [
        [-90, -195],
        [90, 195],
      ],
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 2,
    }).addTo(this.map);

    const cities: Object = {
      London: new City('London', '51.51', '-0.13'),
      'New York': new City('New York', '40.71', '-74.01'),
      Tokyo: new City('Tokyo', '35.69', '139.69'),
      Sydney: new City('Sydney', '-33.87', '151.21'),
      Bratislava: new City('Bratislava', '48.15', '17.11'),
      Paris: new City('Paris', '48.85', '2.35'),
    };

    for (let i: number = 0; i < this.markers.length; i++) {
      L.marker([this.markers[i][1], this.markers[i][2]], {
        icon: mapLocationMarker,
      })
        .bindTooltip(this.markers[i][0])
        .addTo(this.map)
        .on('click', (e: L.LeafletMouseEvent) => {
          this.authGuard.isCitySelected = true;
          const marker: string = e.target._tooltip._content;
          const city: City = cities[marker];
          localStorage.setItem('city', JSON.stringify(city));
          this.routeToWeatherDataTable();
        });
    }
  }

  routeToWeatherDataTable(): Promise<boolean> {
    return this.router.navigate(['/weather-data']);
  }
}
