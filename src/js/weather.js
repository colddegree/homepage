import * as moment from "moment";
import * as ElementUtils from "./element-utils";
import * as LoadingSpinner from "./loading-spinner";

export function loadPage() {
    console.log("You're at /weather.html now");

    const citySelect = document.getElementById("city-select");
    const weatherView = document.getElementById("weather-view");

    const handler = () => {
        ElementUtils.clear(weatherView);

        console.log("Selected city: " + citySelect.value);

        const url = getUrl(citySelect.value);

        console.log("fetching... " + url);

        LoadingSpinner.show();

        fetch(url)
            .then(response => response.json())
            .then(json => {
                return {
                    status: json.weather[0].description.capitalize(),
                    statusIconUrl: getIconUrl(json.weather[0].icon),
                    temperature: String(Math.round(json.main.temp)).replace("-", "− "),
                    pressure: Math.round(hPa_to_mmHg(json.main.pressure)),
                    humidity: json.main.humidity,
                    windSpeed: json.wind.speed,
                    windAngle: Math.round(Number(json.wind.deg)),
                    sunrise: json.sys.sunrise,
                    sunset: json.sys.sunset,
                    calculatedAt: json.dt
                };
            })
            .then(weather => {
                LoadingSpinner.hide();
                updateWeatherView(weatherView, weather);
            });
    };

    citySelect.addEventListener("change", handler);

    (function firstStart() {
        citySelect.selectedIndex = 1;

        handler();
    })();
}

function getUrl(city) {
    const API_URL_PREFIX = "http://api.openweathermap.org/data/2.5/weather?q=";
    const API_URL_SUFFIX = "&units=metric&lang=ru&appid=fae71949ba4d041b7d0cd2ec26dd4b79";

    return API_URL_PREFIX + city + API_URL_SUFFIX;
}

function getIconUrl(iconCode) {
    const API_ICON_URL_PREFIX = "http://openweathermap.org/img/w/";
    const API_ICON_URL_SUFFIX = ".png";

    return API_ICON_URL_PREFIX + iconCode + API_ICON_URL_SUFFIX;
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

function hPa_to_mmHg(hPa) {
    return hPa * 100 / 133.3224;
}

function updateWeatherView(weatherView, weather) {
    weatherView.innerHTML = getWeatherViewHtml(weather);
}

function getWeatherViewHtml(weather) {
    const updatedLocalTime = moment.unix(weather.calculatedAt).local();

    return `
        <header class="main-weather-info">
          ${weather.temperature} °C, ${weather.status}
          <img src="${weather.statusIconUrl}">
        </header>
        <ul>
          <li>
            <img class="icon" src=${require("../svg/weather/atmospheric-pressure.svg")} >
            Атмосферное давление: ${weather.pressure} мм рт. ст.
          </li>
          <li>
            <img class="icon" src=${require("../svg/weather/humidity.svg")} >
            Влажность: ${weather.humidity}%
          </li>
          <li>
            <img class="icon" src=${require("../svg/weather/wind.svg")} >
            Скорость ветра: ${weather.windSpeed} м/с, направление (угол): ${weather.windAngle}°
          </li>
          <li>
            <img class="icon" src=${require("../svg/weather/sunrise.svg")} >
            Рассвет
            ${(moment.unix(weather.sunrise).isBefore(moment.now()))
                ? " был "
                : " будет "}
            ${moment.unix(weather.sunrise).fromNow()}
          </li>
          <li>
            <img class="icon" src=${require("../svg/weather/sunset.svg")} >
            Закат
            ${(moment.unix(weather.sunset).isBefore(moment.now()))
                ? " был "
                : " будет "}
            ${moment.unix(weather.sunset).fromNow()}
          </li>
        </ul>
        <hr>
        <footer>
          Обновлено ${updatedLocalTime.format("LLL")} (${updatedLocalTime.local().fromNow()})
        </footer>`;
}
