const NEWS_API_KEY = "f8d16fe4640d4bea95117413bf22dedb"; // Replace with your News API key
const WEATHER_API_KEY = "1ebdb39ae9638da4e12c57453af79c0c"; // Replace with your OpenWeatherMap API key
const newsUrl = "https://newsapi.org/v2/everything?q=";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?";

window.addEventListener("load", () => {
    fetchWeather();
    fetchNews("India");
});

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const res = await fetch(`${newsUrl}${query}&apiKey=${NEWS_API_KEY}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
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

// Fetching Weather Information
async function fetchWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const res = await fetch(`${weatherUrl}lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
            const data = await res.json();
            displayWeather(data);
        });
    } else {
        document.getElementById("weather-info").innerHTML = "Geolocation is not supported by this browser.";
    }
}

function displayWeather(data) {
    const weatherStatus = document.getElementById("weather-status");
    const temperature = document.getElementById("temperature");
    const weatherIcon = document.getElementById("weather-icon");

    weatherStatus.innerHTML = `Weather: ${data.weather[0].description}`;
    temperature.innerHTML = `Temp: ${data.main.temp}°C`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    weatherIcon.style.display = "inline"; // Show the icon
}
