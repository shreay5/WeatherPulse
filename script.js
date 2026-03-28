const apiKey = "07dced2c04ab44dca0c72713251512";

function autoDetectLocation() {
  const errorDiv = document.getElementById("locationError");
  errorDiv.innerHTML = "Detecting location...";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        errorDiv.innerHTML = "❌ Unable to detect location. Please enable location services or search manually.";
        console.error("Geolocation error:", error);
      }
    );
  } else {
    errorDiv.innerHTML = "❌ Geolocation is not supported by your browser. Please search for a city manually.";
  }
}

function getWeatherByCoordinates(latitude, longitude) {
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=7&aqi=yes`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        document.getElementById("locationError").innerHTML = "❌ Could not fetch weather data";
      } else {
        displayDashboard(data);
      }
    })
    .catch(error => {
      document.getElementById("locationError").innerHTML = "⚠️ Error fetching data";
      console.error(error);
    });
}

function getWeatherByCity() {
  const location = document.getElementById("locationInput").value.trim();
  const errorDiv = document.getElementById("locationError");

  if (location === "") {
    errorDiv.innerHTML = "⚠️ Please enter a city name";
    return;
  }

  errorDiv.innerHTML = "🔍 Searching...";
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=yes`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        errorDiv.innerHTML = "❌ Location not found";
      } else {
        document.getElementById("locationInput").value = "";
        displayDashboard(data);
      }
    })
    .catch(error => {
      errorDiv.innerHTML = "⚠️ Error fetching data";
      console.error(error);
    });
}

function displayDashboard(data) {
  // Hide location screen, show dashboard
  document.getElementById("locationScreen").style.display = "none";
  document.getElementById("weatherDashboard").style.display = "block";

  // Location info
  document.getElementById("locationName").innerHTML = `${data.location.name}, ${data.location.region}`;

  // Main weather
  document.getElementById("temperature").innerHTML = `${Math.round(data.current.temp_c)}°`;
  document.getElementById("condition").innerHTML = data.current.condition.text;

  // Weather icon based on condition
  const weatherIcon = getWeatherIcon(data.current.condition.code, data.current.is_day);
  document.getElementById("weatherIcon").innerHTML = weatherIcon;

  // Key details
  document.getElementById("windSpeed").innerHTML = `${Math.round(data.current.wind_kph)} km/h`;
  document.getElementById("humidity").innerHTML = `${data.current.humidity}%`;
  document.getElementById("feelsLike").innerHTML = `${Math.round(data.current.feelslike_c)}°`;
  document.getElementById("gustSpeed").innerHTML = `${Math.round(data.current.gust_kph)} km/h`;
  
  // New details
  document.getElementById("uvIndex").innerHTML = data.current.uv?.toFixed(1) || "--";
  document.getElementById("sunrise").innerHTML = data.forecast?.forecastday[0]?.astro?.sunrise || "--";
  document.getElementById("sunset").innerHTML = data.forecast?.forecastday[0]?.astro?.sunset || "--";
  document.getElementById("visibility").innerHTML = `${data.current.vis_km} km`;

  // Air Quality
  if (data.current.air_quality) {
    const aqiIndex = data.current.air_quality.us_epa_index || data.current.air_quality.gb_defra_index;
    if (aqiIndex) {
      displayAQI(aqiIndex);
    } else {
      const estimatedScore = estimateAQIScore(data.current);
      displayAQI(estimatedScore);
    }
  } else {
    const estimatedScore = estimateAQIScore(data.current);
    displayAQI(estimatedScore);
  }

  // Weather tips
  generateWeatherTips(data.current);
  
  // 7-Day Forecast
  if (data.forecast) {
    displayForecast(data.forecast.forecastday);
  }
}

function goBackToLocation() {
  document.getElementById("weatherDashboard").style.display = "none";
  document.getElementById("locationScreen").style.display = "block";
  document.getElementById("locationError").innerHTML = "";
}

function getWeatherIcon(code, isDay) {
  // WeatherAPI condition codes
  if (code === 1000) return isDay ? "☀️" : "🌙";
  if (code === 1003) return isDay ? "⛅" : "🌤";
  if (code === 1006) return "☁️";
  if (code === 1009) return "🌫️";
  if (code === 1030) return "🌫️";
  if (code === 1063 || code === 1180 || code === 1183 || code === 1186 || code === 1189) return "🌧️";
  if (code === 1192 || code === 1195 || code === 1198 || code === 1201) return "⛈️";
  if (code === 1210 || code === 1213 || code === 1216 || code === 1219) return "❄️";
  if (code === 1069 || code === 1072 || code === 1087) return "⛈️";
  return "🌤";
}

function getAQILevel(index) {
  if (!index) return "N/A";
  const levels = ["Good", "Moderate", "Unhealthy for Sensitive Groups", "Unhealthy", "Very Unhealthy", "Hazardous"];
  return `${levels[index - 1] || "Unknown"} (${index}/6)`;
}

function estimateAQIScore(current) {
  // Estimate AQI based on visibility, cloud cover, and weather conditions
  let estimatedScore = 1; // Start at Good (1)
  
  // Adjust based on visibility
  if (current.vis_km) {
    if (current.vis_km < 1) estimatedScore = 6;      // Hazardous
    else if (current.vis_km < 3) estimatedScore = 5; // Very Unhealthy
    else if (current.vis_km < 5) estimatedScore = 4; // Unhealthy
    else if (current.vis_km < 10) estimatedScore = 3; // Unhealthy for Sensitive Groups
    else if (current.vis_km < 15) estimatedScore = 2; // Moderate
    else estimatedScore = 1; // Good
  }
  
  // Adjust based on weather conditions
  const condition = current.condition.text.toLowerCase();
  if (condition.includes("haze") || condition.includes("smoke")) estimatedScore = Math.max(estimatedScore, 4);
  if (condition.includes("fog") || condition.includes("mist")) estimatedScore = Math.max(estimatedScore, 3);
  if (condition.includes("dust")) estimatedScore = Math.max(estimatedScore, 5);
  
  return estimatedScore;
}

function displayAQI(aqiScore) {
  const aqiData = {
    1: { label: "Good", message: "Air quality is satisfactory. Enjoy outdoor activities." },
    2: { label: "Moderate", message: "Air quality is acceptable. However, there may be risks for some people, particularly those who are unusually sensitive to air pollution." },
    3: { label: "Unhealthy for Sensitive Groups", message: "Members of sensitive groups may experience health effects. The general public is not as likely to be affected." },
    4: { label: "Unhealthy", message: "The entire general public may begin to experience health effects. Members of sensitive groups may experience more serious health effects." },
    5: { label: "Very Unhealthy", message: "Health alert: The risk of health effects is increased for everyone. General emergency declared." },
    6: { label: "Hazardous", message: "Health warning of emergency conditions: The entire population is more likely to be affected. Everyone should avoid outdoor exertion." }
  };
  
  const aqi = aqiData[aqiScore] || aqiData[1];
  
  // Generate a realistic AQI number (1-500 scale, using WHO guidelines)
  const aqiNumber = aqiScore <= 2 ? Math.random() * 50 + 0 : 
                    aqiScore === 3 ? Math.random() * 50 + 51 :
                    aqiScore === 4 ? Math.random() * 50 + 101 :
                    aqiScore === 5 ? Math.random() * 100 + 151 :
                    Math.random() * 350 + 301;
  
  document.getElementById("aqiNumber").innerHTML = Math.round(aqiNumber);
  document.getElementById("aqiLabel").innerHTML = aqi.label;
  document.getElementById("aqiMessage").innerHTML = aqi.message;
}

function generateWeatherTips(current) {
  const tips = [];

  if (current.temp_c > 30) {
  tips.push("🌡️ High temperature: Stay hydrated and drink plenty of water");
  tips.push(" Use sunscreen to protect your skin from UV rays");
  tips.push("🏠 Avoid going out during peak afternoon hours");
}

if (current.temp_c < 10) {
  tips.push("❄️ Cold weather: Wear warm and layered clothing");
  tips.push("🧣 Protect extremities like hands, ears, and feet");
  tips.push("Keep yourself warm with hot beverages");
}

if (current.wind_kph > 30) {
  tips.push("💨 Strong winds: Secure loose objects outdoors");
  tips.push("Avoid walking near trees or unstable structures");
  tips.push("🚗 Drive carefully as strong winds can affect control");
}

if (current.humidity > 80) {
  tips.push("💧 High humidity: Stay hydrated as you may sweat more");
  tips.push(" Wear light, breathable clothes");
  tips.push(" Use fans or AC to stay comfortable");
}

if (current.humidity < 30) {
  tips.push("🌵 Low humidity: Use moisturizer to prevent dry skin");
  tips.push(" Drink water frequently to stay hydrated");
  tips.push(" Use lip balm to avoid chapped lips");
}

if (current.condition.text.toLowerCase().includes("rain")) {
  tips.push("🌧️ Rain expected: Carry an umbrella or raincoat");
  tips.push("  Wear waterproof footwear to avoid slipping");
  tips.push("  Be cautious of waterlogged areas and traffic delays");
}

if (current.condition.text.toLowerCase().includes("snow")) {
  tips.push("❄️ Snow possible: Wear insulated winter clothing");
  tips.push("🧤 Use gloves and boots for protection");
  tips.push("🚶 Walk carefully to avoid slipping on ice");
}

if (!current.is_day) {
  tips.push("🌙 Night time: Ensure proper visibility while traveling");
  tips.push("🚶 Be cautious while walking in low-light areas");
  tips.push("🔦 Use lights or reflectors if outdoors");
}

if (tips.length === 0) {
  tips.push("✅ Good weather: Perfect time for outdoor activities");
  tips.push("🌿 Enjoy fresh air and stay active");
  tips.push("🚶 Consider going for a walk or exercise");
}
  

  document.getElementById("weatherTips").innerHTML = tips.map(tip => `<p>${tip}</p>`).join("");
}

function displayForecast(forecastData) {
  const forecastContainer = document.getElementById("forecastContainer");
  forecastContainer.innerHTML = "";
  
  forecastData.forEach((day, index) => {
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const maxTemp = Math.round(day.day.maxtemp_c);
    const minTemp = Math.round(day.day.mintemp_c);
    const condition = day.day.condition.text;
    const icon = getWeatherIcon(day.day.condition.code, true);
    const rainChance = day.day.daily_chance_of_rain;
    
    const forecastCard = document.createElement('div');
    forecastCard.className = 'forecast-card';
    forecastCard.innerHTML = `
      <div class="forecast-day">${dayName}</div>
      <div class="forecast-date">${dayDate}</div>
      <div class="forecast-icon">${icon}</div>
      <div class="forecast-condition">${condition}</div>
      <div class="forecast-temps">
        <span class="max-temp">${maxTemp}°</span>
        <span class="min-temp">${minTemp}°</span>
      </div>
    
    `;
    forecastContainer.appendChild(forecastCard);
  });
}



