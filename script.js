const API_KEY = "f8d16fe4640d4bea95117413bf22dedb";
const url = "https://newsapi.org/v2/everything?q=";
const weatherApiKey = "1ebdb39ae9638da4e12c57453af79c0c"; // Replace with your OpenWeatherMap API key
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";

// Fetch weather based on location
function fetchWeather(lat, lon) {
    fetch(`${weatherUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`)
        .then((response) => response.json())
        .then((data) => {
            displayWeather(data);
        })
        .catch((error) => console.error("Error fetching weather data:", error));
}

// Display weather in the navigation bar
function displayWeather(data) {
    const weatherTemp = document.getElementById("weather-temp");
    const weatherIcon = document.getElementById("weather-icon");

    const temperature = Math.round(data.main.temp); // Temperature in Celsius
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherTemp.textContent = `${temperature}°C`;
    weatherIcon.src = iconUrl;
}

// Get the user's location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeather(lat, lon);
            },
            (error) => {
                console.error("Error fetching location", error);
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

// Fetch news and weather on window load
window.addEventListener("load", () => {
    fetchNews("India");
    getUserLocation(); // Get the user's location on load
});

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
