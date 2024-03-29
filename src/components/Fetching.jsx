import axios from "axios";
import { useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const WeatherApp = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const[error, setError] = useState(null);

    const handleSearch = async () => {
        try {
            console.log(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=19e3f7ee69c038cbc7d0f0f34781f64a`);
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=19e3f7ee69c038cbc7d0f0f34781f64a`);
            console.log(response.data);
            setWeatherData(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setWeatherData(null);
            setError('City not found');
        }
    };

    return (
        <div>
            <h1>Weather App</h1>
            <div>
                <input 
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            {error && <p>{error}</p>}
            {weatherData && (
                <div>
                    <h2>Current Weather in {weatherData.name}</h2>
                    <p>{weatherData.weather[0].icon && (
                                        <img src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="Weather Icon" />
                                    )}</p>
                    <table>
                        <tbody>
                            <tr>
                                <td>Temperature:</td>
                                <td>{(weatherData.main.temp - 273.15).toFixed(0)} °C</td>
                            </tr>
                            <tr>
                                <td>Feels Like:</td>
                                <td>{(weatherData.main.feels_like - 273.15).toFixed(0)} °C</td>
                            </tr>
                            <tr>
                                <td>Humidity:</td>
                                <td>{weatherData.main.humidity}%</td>
                            </tr>
                            <tr>
                                <td>Pressure:</td>
                                <td>{weatherData.main.pressure} hPa</td>
                            </tr>
                            <tr>
                                <td>Weather:</td>
                                <td>{weatherData.weather[0].description}</td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default WeatherApp;