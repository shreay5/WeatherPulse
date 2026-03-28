# 🌤 WeatherPulse

A professional government weather website built with vanilla JavaScript, featuring real-time weather data, air quality index monitoring, and intelligent weather tips.

## Features

### 📍 Location Selection
- **Auto-detect Location**: Uses browser geolocation API to automatically detect your location
- **Manual Search**: Search for any city worldwide
- Clean, intuitive interface for easy navigation

### Weather Dashboard
A comprehensive weather display inspired by government weather services like NOAA and UK Met Office.

**Key Weather Details:**
- 💨 Wind Speed (km/h)
- 💧 Humidity (%)
- 🌡 Feels Like Temperature (°C)
- 💨 Wind Gust Speed (km/h)

### 🌫 Air Quality Index (AQI)
- Real-time AQI score display
- Health-based classification (Good, Moderate, Unhealthy, etc.)
- Detailed health recommendations based on AQI level
- Color-coded alert system (Red for poor air quality)

**AQI Levels:**
- **1-50 (Good)**: Air quality is satisfactory
- **51-100 (Moderate)**: Acceptable with possible risks for sensitive groups
- **101-150 (Unhealthy for Sensitive Groups)**: Members of sensitive groups may experience health effects
- **151-200 (Unhealthy)**: General public may begin to experience health effects
- **201-300 (Very Unhealthy)**: Health alert - increased risk for everyone
- **301-500 (Hazardous)**: Health warning - entire population affected

### 💡 Smart Weather Tips
Intelligent, context-aware tips based on current weather conditions:
- Temperature warnings (extreme heat/cold)
- Humidity alerts
- Wind warnings
- Precipitation notifications
- UV and activity recommendations


## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **API**: WeatherAPI.com for real-time weather data
- **Styling**: Pure CSS3 with responsive design
- **Storage**: Browser Geolocation API
- **Deployment**: Static HTML/CSS/JS

## Project Structure

```
WeatherPulse/
├── index.html          # Main HTML structure
├── script.js           # JavaScript functionality
├── style.css           # Professional styling
└── README.md           # Documentation
```

## How to Use

1. **Open the App**
   - Open `index.html` in any modern web browser

2. **Select Location**
   - Click "📍 Auto-detect Location" to use your device's location
   - Or enter a city name and click "Search"

3. **View Weather Dashboard**
   - Temperature and conditions
   - Key weather metrics
   - Air quality information
   - Personalized tips

4. **Change Location**
   - Click "← Change Location" button to search for another city

## API Integration

The app uses **WeatherAPI.com** for weather data with the following features:
- Current weather conditions
- Real-time air quality data
- Visibility and wind information
- Geolocation-based searches

**API Endpoint:**
```
https://api.weatherapi.com/v1/current.json?key={API_KEY}&q={LOCATION}&aqi=yes
```

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Features in Detail

### 🔍 Search Functionality
- Search by city name (e.g., "London", "New York", "Mumbai")
- Auto-complete suggestions
- Error handling for invalid locations
- Input validation

### 📊 AQI Calculation
- Real API data when available
- Estimated calculation based on visibility and weather conditions
- Fallback system ensures users always see AQI information

### 🎯 Responsive Design
- Desktop: Full-featured dashboard (1000px max-width)
- Tablet: Optimized grid layout
- Mobile: Single-column layout with touch-friendly buttons

## Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection for weather data
- (Optional) Geolocation permission for auto-detection

### Installation
```bash
# No installation required
# Simply open index.html in your browser
```

### Development
To modify the app:
1. Edit `index.html` for structure changes
2. Modify `script.js` for functionality
3. Update `style.css` for styling


## Troubleshooting

### AQI Shows "Not Available"
- Some locations may not have AQI data available
- The app will estimate AQI based on visibility and weather conditions
- Check browser console (F12) for detailed debug information

### Location Not Found
- Ensure the city name is spelled correctly
- Try using country names (e.g., "London, UK")
- Check your internet connection

### Auto-detect Not Working
- Enable location services in browser settings
- Check if you've granted location permission
- Try manual city search instead

## Privacy & Data

- No personal data is stored locally
- Location data is only used for weather lookup
- All data is fetched from WeatherAPI.com
- No tracking or analytics implemented

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to fork, submit issues, and create pull requests.

## Support

For issues or questions, please create an issue in the repository.

---

**Version:** 1.0.0  
**Last Updated:** March 28, 2026  
**Repository:** WeatherPulse (shreay5)
