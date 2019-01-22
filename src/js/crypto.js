import * as moment from "moment";

export function loadPage() {
    console.log("You're at /crypto.html now");

    const baseCurrencySelect = document.getElementById("base-currency-select");
    const targetCurrencySelect = document.getElementById("target-currency-select");

    const currencyRateView = document.getElementById("currency-rate-view");

    const handler = () => {
        if (baseCurrencySelect.selectedIndex === 0 || targetCurrencySelect.selectedIndex === 0)
            return;

        clearElement(currencyRateView);
        hideErrorMessage();

        console.log("Selected base currency: ", baseCurrencySelect.value);
        console.log("Selected target currency: ", targetCurrencySelect.value);

        const url = getUrl(baseCurrencySelect.value, targetCurrencySelect.value);

        console.log("fetching... " + url);

        showLoadingSpinner();

        fetch(url)
            .then(response => response.json())
            .then(json => {
                if (!json.success) {
                    if (json.error === "Select different currencies")
                        throw new Error("Ошибка: выбраны одинаковые валюты")
                    else
                        throw new Error(json.error)
                }
                return json;
            })
            .then(json => {
                return {
                    baseCurrency: json.ticker.base,
                    targetCurrency: json.ticker.target,
                    exchangeRate: json.ticker.price,
                    totalTradeVolumeForLast24Hours: json.ticker.volume,
                    pastHourPriceChange: json.ticker.change,
                    updatedAt: json.timestamp
                }
            })
            .then(rate => {
                hideLoadingSpinner();
                updateCurrencyRateView(currencyRateView, rate);
            })
            .catch(error => {
                console.log(error.message);

                hideLoadingSpinner();
                displayErrorMessage(error.message);
            });
    };

    baseCurrencySelect.addEventListener("change", handler);
    targetCurrencySelect.addEventListener("change", handler);
}

function getUrl(baseCurrencyCode, targetCurrencyCode) {
    const API_BASE_URL = "https://api.cryptonator.com/api/ticker/";

    return API_BASE_URL + baseCurrencyCode + "-" + targetCurrencyCode;
}

function updateCurrencyRateView(currencyRateView, rate) {
    console.log("updateCurrencyRateView(currencyRateView, rate):");
    console.log("currencyRateView: ", currencyRateView);
    console.log("rate: ", rate);

    currencyRateView.innerHTML = getCurrencyRateView(rate);
}

function getCurrencyRateView(rate) {
    return `
        <header class="main-currency-rate-info">
          1 ${rate.baseCurrency} стоит ${rate.exchangeRate} ${rate.targetCurrency}
        </header>
        <ul>
          <li>
            Объём продаж за последние 24 часа: ${rate.totalTradeVolumeForLast24Hours} ${rate.baseCurrency} <!-- base currency? -->
          </li>
          <li>
            Изменение курса за последний час: ${rate.pastHourPriceChange} ${rate.targetCurrency} <!-- target currency? -->
          </li>
        </ul>
        <hr>
        <footer>
          Обновлено ${moment.unix(rate.updatedAt).local().format("LLL")}
        </footer>`;
}

function clearElement(element) {
    element.innerHTML = "";
}

function showLoadingSpinner() {
    const spinner = document.getElementById("loading-spinner");
    spinner.classList.remove("hidden");
}

function hideLoadingSpinner() {
    const spinner = document.getElementById("loading-spinner");
    spinner.classList.add("hidden");
}

function displayErrorMessage(msg) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.innerHTML = msg;
    errorMessage.classList.remove("hidden");
}

function hideErrorMessage() {
    const errorMessage = document.getElementById("error-message");
    errorMessage.innerHTML = "";
    errorMessage.classList.add("hidden");
}