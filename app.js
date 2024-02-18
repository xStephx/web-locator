'use strict';

// Вчитување на API клучот од конфигурацискиот фајл
import API_KEY from './config.js';

// Сокривање на учитувачот по 1.5 секунди
setTimeout(() => {
  document.querySelector('.loader').style.display = 'none';
  document.querySelector('.main-container').style.display = 'flex';
}, 1500);

// Дефинирање на HTML елементите од DOM
const ipAddressField = document.querySelector('.ipAddressField');
const timezoneInput = document.querySelector('.timezoneInput');
const countryLocationInput = document.querySelector('.locationInput');
const ispInput = document.querySelector('.ispInput');
const submitBtn = document.querySelector('.submit-btn');
const inputField = document.querySelector('.input-field');
const countryFlagImg = document.querySelector('.country-flag');
const callingNum = document.querySelector('.callingNum');
const countryTLD = document.querySelector('.countryTLD');
const moreBtn = document.querySelector('.more-btn');

// Иницијализација на мапата
let map = L.map('map').setView([51.505, -0.09], 13);

// Додавање на слој на мапата од OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Иницијализација на променливи за податоците од API
let ipAddress;
let randomIP = '';
let timeZone;
let continent;
let countryLocation;
let countryFlag;
let cityLocation;
let postalCode;
let callingCode;
let countryTLDValue;
let isp;
let lat;
let lng;

// URL за вчитување на податоците за тековната IP адреса
let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}=`;

// Вчитување на податоците за тековната IP адреса
fetch(url)
  .then((response) => response.json())
  .then((response) => {
    // Поставување на податоците од API во соодветни променливи
    ipAddress = response.ip;
    timeZone = response.time_zone.offset;
    continent = response.continent_name;
    countryLocation = response.country_name;
    countryFlag = response.country_code2;
    cityLocation = response.city;
    postalCode = response.zipcode;
    callingCode = response.calling_code;
    countryTLDValue = response.country_tld;
    isp = response.isp;
    lat = response.latitude;
    lng = response.longitude;

    // Прикажување на податоците во соодветните HTML елементи
    ipAddressField.innerHTML = ipAddress;
    timezoneInput.innerHTML = ` UTC ${timeZone}`;
    countryLocationInput.innerHTML = `${continent}, ${countryLocation}, ${cityLocation} ${postalCode}`;
    ispInput.innerHTML = isp;
    callingNum.innerHTML = callingCode;
    countryTLD.innerHTML = countryTLDValue;
    countryFlagImg.src = `https://ipgeolocation.io/static/flags/${countryFlag.toLowerCase()}_64.png`;
    countryFlagImg.title = countryLocation;

    // Прикажување на локацијата на мапата
    mapLocation(lat, lng);
  })
  .catch((error) => console.log(error));

// Функција за прикажување на локацијата на мапата
const mapLocation = (lat, lng) => {
  var markerIcon = L.icon({
    iconUrl: 'img/icon-location.svg',
    iconSize: [46, 56],
    iconAnchor: [23, 55],
  });

  // Поставување на погледот на мапата
  map.setView([lat, lng], 17);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: false,
  }).addTo(map);

  // Додавање на маркер на мапата
  L.marker([lat, lng], { icon: markerIcon }).addTo(map);
};

// Пребарување по IP и валидација
submitBtn.addEventListener('click', (event) => {
  event.preventDefault();
  // Валидација на внесената IP адреса (IPv4 или IPv6)
  if (
    inputField.value.match(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    ) || // IPv4
    inputField.value.match(
      /^([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$/
    ) || // IPv6
    inputField.value.match(
      /^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{0,4}$/
    ) // IPv6 (скратена)
  ) {
    randomIP = inputField.value;
    url = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}=${randomIP}`;
    // Вчитување на податоците за внесената IP адреса
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        ipAddress = response.ip;
        timeZone = response.time_zone.offset;
        continent = response.continent_name;
        countryLocation = response.country_name;
        countryFlag = response.country_code2;
        cityLocation = response.city;
        postalCode = response.zipcode;
        callingCode = response.calling_code;
        countryTLDValue = response.country_tld;
        isp = response.isp;
        lat = response.latitude;
        lng = response.longitude;

        ipAddressField.innerHTML = ipAddress;
        timezoneInput.innerHTML = ` UTC ${timeZone}`;
        countryLocationInput.innerHTML = `${continent}, ${countryLocation}, ${cityLocation} ${postalCode}`;
        ispInput.innerHTML = isp;
        callingNum.innerHTML = callingCode;
        countryTLD.innerHTML = countryTLDValue;
        countryFlagImg.src = `https://ipgeolocation.io/static/flags/${countryFlag.toLowerCase()}_64.png`;
        countryFlagImg.title = countryLocation;

        mapLocation(lat, lng);
      })
      .catch((error) => console.log(error));
  } else {
    alert('Внесовте погрешна IP адреса!');
    return false;
  }
});

// Повеќе информации преку копче
moreBtn.addEventListener('click', () => {
  url = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}=${randomIP}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const popupContent = `
        <span class="popup-close-btn" onclick="closePopup()">&times;</span>
        <h2>Повеќе</h2>
        <p>Област: ${data.state_prov}</p>
        <p>Име на временска зона: ${data.time_zone.name}</p>
        <p>Ознака за држава: ${data.country_code3}</p>
        <p>Главен Град: ${data.country_capital}</p>
        <p>Јазици: ${data.languages}</p>
        <p>Валута: ${data.currency.name}</p>
        <p>Симбол на Валута: ${data.currency.symbol}</p>
        <p>Датум и време: ${data.time_zone.current_time}</p>
      `;

      const popup = document.createElement('div');
      popup.classList.add('popup');
      popup.innerHTML = popupContent;

      document.body.appendChild(popup);
      popup.offsetHeight;
      popup.classList.add('show');

      window.closePopup = function () {
        popup.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(popup);
        }, 500);
      };
    })
    .catch(error => console.error(error));
});


