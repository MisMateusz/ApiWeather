import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherData } from '../models/weather.model';
import { Root as WeatherDataFiveRoot } from '../models/weatherFiveDays.model';

@Injectable({ providedIn: 'root' })
export class Weather {
  constructor(private http: HttpClient) {}

  getWeatherData(cityName: string): Observable<WeatherData> {
    return this.http.get<WeatherData>('http://localhost:3000/api/weather', {
      params: new HttpParams().set('city', cityName),
    });
  }

  getWeatherDataFiveDays(lat: number, lon: number): Observable<WeatherDataFiveRoot> {
    return this.http.get<WeatherDataFiveRoot>('http://localhost:3000/api/weather5', {
      params: new HttpParams().set('lat', lat.toString()).set('lon', lon.toString()),
    });
  }
}