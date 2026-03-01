import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherData } from '../models/weather.model';
import { Root as WeatherDataFiveRoot } from '../models/weatherFiveDays.model';

@Injectable({
  providedIn: 'root',
})
export class Weather {
  private apiKey: string = '';

  constructor(private http: HttpClient) {
    const secret = 'mysecret';
    this.http.get<any>(`http://localhost:3000/apiWeather?secret=${secret}`).subscribe(data => {
      this.apiKey = data.apiKey;
    });
  }

  getWeatherData(cityName: string): Observable<WeatherData> {
    return this.http.get<WeatherData>('https://open-weather13.p.rapidapi.com/city', {
      headers: new HttpHeaders()
        .set('x-rapidapi-host', 'open-weather13.p.rapidapi.com')
        .set('x-rapidapi-key', this.apiKey),
      params: new HttpParams()
        .set('city', cityName)
        .set('lang', 'EN')
    });
  }

  getWeatherDataFiveDays(lat: number, lon: number): Observable<WeatherDataFiveRoot> {
    return this.http.get<WeatherDataFiveRoot>('https://open-weather13.p.rapidapi.com/fivedaysforcast', {
      headers: new HttpHeaders()
        .set('x-rapidapi-host', 'open-weather13.p.rapidapi.com')
        .set('x-rapidapi-key', this.apiKey),
      params: new HttpParams()
        .set('latitude', lat)
        .set('longitude', lon)
        .set('lang', 'EN')
    });
  }
}