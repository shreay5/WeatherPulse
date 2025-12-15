const apiKey = "07dced2c04ab44dca0c72713251512";

function getWeather() {
  const location = document.getElementById("locationInput").value;
  const resultDiv = document.getElementById("weatherResult");

  if (location === "") {
    resultDiv.innerHTML = "⚠️ Please enter a city name";
    return;
  }

  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        resultDiv.innerHTML = "❌ Location not found";
      } else {
        resultDiv.innerHTML = `
          <h3>${data.location.name}, ${data.location.country}</h3>
          <p>🌡 Temperature: <strong>${data.current.temp_c}°C</strong></p>
          <p>🌥 Condition: ${data.current.condition.text}</p>
        `;
      }
    })
    .catch(error => {
      resultDiv.innerHTML = "⚠️ Error fetching data";
      console.error(error);
    });
}
