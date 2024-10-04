const API_KEY = "f8d16fe4640d4bea95117413bf22dedb";
const WEATHER_API_KEY = "1ebdb39ae9638da4e12c57453af79c0c"; // Replace with your OpenWeather API key
const url = "https://newsapi.org/v2/everything?q=";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?";

window.addEventListener("load", () => {
    fetchNews("India");
    fetchWeather();
});

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const apiUrl = `${url}${query}&apiKey=${API_KEY}`;
    const res = await fetch(proxyUrl + apiUrl);
    
    if (!res.ok) {
        console.error("Failed to fetch news:", res.statusText);
        return;
    }
    
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

// Weather Functionality
async function fetchWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const weatherRes = await fetch(`${weatherUrl}lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`);
            const weatherData = await weatherRes.json();
            displayWeather(weatherData);
        }, () => {
            console.error("Unable to retrieve your location");
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function displayWeather(data) {
    const weatherLocation = document.getElementById("weather-location");
    const weatherTemp = document.getElementById("weather-temp");
    const weatherIcon = document.getElementById("weather-icon");

    weatherLocation.innerHTML = `${data.name}, ${data.sys.country}`;
    weatherTemp.innerHTML = `${Math.round(data.main.temp)}°C`;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}
