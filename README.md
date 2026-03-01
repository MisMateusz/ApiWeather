# ApiWeather

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4.

## Development server

Begin with running backend server with:

```bash
cd backend
node index.js
```
It will start backend that will provide key to call API.
In console you will get message that server is running on set port, (if you follow that address, there will another address to navigate you to the app).

All secrets such as apiKey is hidden in .env file. It has structure:
API_KEY = 'your_api_key' paste your key from: https://rapidapi.com/worldapi/api/open-weather13
PORT = your_port //it has to be number to work, preferably it should be 3000, but you can change it to any number, just don't forget changing port in weather.ts file as otherwise it will not work
CLIENT_SECRET = 'mysecret'

To start a local development server, run:

```bash
cd frontend
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Quick know-app-how

Its simple app using api to get weather data. After searching city on main window will be shown current temperature. Only if you searched city, you will have possibility to extend shown data with forecast (from current day to fourth day ahead).

This app have only educational purpose only, thus it shouldn't be used in any way to make money.
