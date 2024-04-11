// import axios from "axios";
// import { useState } from "react"
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// const WeatherApp = () => {
//     const [city, setCity] = useState('');
//     const [weatherData, setWeatherData] = useState(null);
//     const[error, setError] = useState(null);
//     const apiKey = import.meta.env.VITE_API_KEY;

//     const handleSearch = async () => {
//         try {
//             console.log(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
//             const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
//             console.log(response.data);
//             setWeatherData(response.data);
//             setError(null);
//         } catch (error) {
//             console.error('Error fetching weather data:', error);
//             setWeatherData(null);
//             setError('City not found');
//         }
//     };

//     return (
//         <div>
//             <h1>Weather App</h1>
//             <div>
//                 <input 
//                     type="text"
//                     value={city}
//                     onChange={(e) => setCity(e.target.value)}
//                     placeholder="Enter city name"
//                 />
//                 <button onClick={handleSearch}>Search</button>
//             </div>
//             {error && <p>{error}</p>}
//             {weatherData && (
//                 <div>
//                     <h2>Current Weather in {weatherData.name}</h2>
//                     <p style={{backgroundColor : '#B0C4DE'}}>{weatherData.weather[0].icon && (
//                                         <img src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="Weather Icon" />
//                                     )}</p>
//                     <table>
//                         <tbody>
//                             <tr>
//                                 <td>Temperature:</td>
//                                 <td>{(weatherData.main.temp - 273.15).toFixed(0)} °C</td>
//                             </tr>
//                             <tr>
//                                 <td>Feels Like:</td>
//                                 <td>{(weatherData.main.feels_like - 273.15).toFixed(0)} °C</td>
//                             </tr>
//                             <tr>
//                                 <td>Humidity:</td>
//                                 <td>{weatherData.main.humidity}%</td>
//                             </tr>
//                             <tr>
//                                 <td>Pressure:</td>
//                                 <td>{weatherData.main.pressure} hPa</td>
//                             </tr>
//                             <tr>
//                                 <td>Weather:</td>
//                                 <td>{weatherData.weather[0].description}</td>
//                             </tr>
                            
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default WeatherApp;

import axios from "axios";
import { useState } from "react";
import { useEffect } from "react"; // Import useEffect
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const WeatherApp = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null); // State for forecast data
    const [error, setError] = useState(null);
    const [showWeather, setShowWeather] = useState(false);
    const [showForecast, setShowForecast] = useState(false);
    const apiKey = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        if (showForecast && city && apiKey) {
            // Fetch forecast data when city or apiKey changes and showForecast is true
            const fetchForecastData = async () => {
                try {
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
                    setForecastData(response.data);
                    setError(null);
                } catch (error) {
                    console.error('Error fetching forecast data:', error);
                    setForecastData(null);
                    setError('Forecast not available');
                }
            };
            fetchForecastData();
        }
    }, [showForecast, city, apiKey]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
            setWeatherData(response.data);
            setShowWeather(true);
            setError(null);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setWeatherData(null);
            setError('City not found');
            setShowWeather(false);
        }
        setShowForecast(true); // Always show forecast section when search button is clicked
    };

    const processForecastData = () => {
        if (forecastData) {
            const dailyForecasts = {};
            forecastData.list.forEach(forecast => {
                const date = new Date(forecast.dt * 1000);
                const day = getDayString(date);
                if (!dailyForecasts[day]) {
                    dailyForecasts[day] = {
                        minTemp: forecast.main.temp_min,
                        maxTemp: forecast.main.temp_max
                    };
                } else {
                    dailyForecasts[day].minTemp = Math.min(dailyForecasts[day].minTemp, forecast.main.temp_min);
                    dailyForecasts[day].maxTemp = Math.max(dailyForecasts[day].maxTemp, forecast.main.temp_max);
                }
            });
            return dailyForecasts;
        }
        return null;
    };

    const getDayString = (date) => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString(undefined, { weekday: 'long' });
        }
    };

    return (
        // <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column' }}>
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
            {showWeather && weatherData && (
                <div style={{ textAlign: 'center' }}>
                    <h2>Current Weather in {weatherData.name}</h2>
                    <p style={{ backgroundColor: '#B0C4DE', width: '200px', marginLeft: '42%'}}>{weatherData.weather[0].icon && (
                        <img 
                        src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} 
                        alt="Weather Icon" 
                        style={{ width: '100px', height: '100px' }} // Adjust the width and height as needed
                    />
                    )}</p>
                    <table style={{ margin: 'auto' }}>
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
            {showForecast && forecastData && (
                <div style={{ border: '2px solid black' }}>
                    <h2>Forecast for {forecastData.city.name}</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {Object.entries(processForecastData()).map(([day, { minTemp, maxTemp }], index) => (
                            <div key={index} style={{ width: '25%' }}>
                                <h3>{day}</h3>
                                <p>Min Temperature: {(minTemp - 273.15).toFixed(0)} °C</p>
                                <p>Max Temperature: {(maxTemp - 273.15).toFixed(0)} °C</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherApp;