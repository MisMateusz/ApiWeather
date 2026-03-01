import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Weather } from './services/weather';

interface ForecastDay {
  date: string;
  temperature: string;
  weather: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  cityInput: string = '';

  city = signal('');
  temperature = signal('');
  temperatureValue = signal<number | null>(null);
  error = signal('');
  loading = signal(false);
  dataLoaded = signal(false);
  forecastDays = signal<ForecastDay[]>([]);

  private isExpanded = false;

  constructor(
    private weatherService: Weather,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  loadWeather() {
    if (!this.cityInput.trim()) {
      this.error.set('Brak nazwy miasta');
      return;
    }

    if (isPlatformBrowser(this.platformId)) {

      this.loading.set(true);
      this.error.set('');
      this.temperature.set('');
      this.temperatureValue.set(null);
      this.city.set('');
      this.forecastDays.set([]);

      this.weatherService.getWeatherData(this.cityInput)
        .subscribe({
          next: (data) => {
            if (!data.name) {
              this.error.set('Nie znaleziono miasta');
              this.loading.set(false);
              return;
            }

            this.error.set('');
            this.loading.set(false);
            this.dataLoaded.set(true);
            this.city.set(data.name);

            if (data.main.temp !== undefined) {
              const celsius = Math.round((data.main.temp - 32) * 5 / 9 * 100) / 100;
              this.temperature.set(`${celsius} °C`);
              this.temperatureValue.set(celsius);
            }

            const lat = data.coord.lat;
            const lon = data.coord.lon;

            this.weatherService.getWeatherDataFiveDays(lat, lon)
              .subscribe({
                next: (forecast) => {
                  if (!forecast || !forecast.list || forecast.list.length === 0) {
                    this.error.set('Nie można pobrać prognozy 5-dniowej');
                    return;
                  }

                  const days: ForecastDay[] = [];
                  for (let i = 0; i < forecast.list.length && days.length < 5; i += 8) {
                    const entry = forecast.list[i];
                    const celsius = Math.round((entry.main.temp - 272.15) * 100) / 100;
                    const dateObj = new Date(entry.dt_txt);
                    const weekday = dateObj.toLocaleDateString('pl-PL', { weekday: 'long' });
                    days.push({
                      date: weekday,
                      temperature: `${celsius} °C`,
                      weather: entry.weather[0].description
                    });
                  }
                  this.forecastDays.set(days);
                },
                error: (err) => {
                  console.error('Forecast error:', err);
                  this.error.set('Błąd podczas pobierania prognozy 5-dniowej');
                }
              });
          },
          error: (err) => {
            this.error.set('Błąd podczas pobierania danych');
            this.loading.set(false);
          }
        });
    }
  }

  expandData() {
    const contentData = document.querySelector('.data') as HTMLElement;
    const contentExpanded = document.querySelector('.DataExpanded') as HTMLElement;
    const expandButton = document.querySelector('.expand') as HTMLElement;

    if (contentExpanded && contentData && this.dataLoaded()) {
      this.isExpanded = !this.isExpanded;
      contentData.style.borderRadius = this.isExpanded ? '1rem 0 0 1rem' : '1rem';
      expandButton.style.rotate = this.isExpanded ? '-180deg' : '0deg';

      if (this.isExpanded) {
        contentExpanded.style.display = 'flex';
        contentExpanded.classList.remove('hiding');
      } else {
        contentExpanded.classList.add('hiding');
        setTimeout(() => {
          contentExpanded.style.display = 'none';
          contentExpanded.classList.remove('hiding');
        }, 400);
      }
    }
  }
}