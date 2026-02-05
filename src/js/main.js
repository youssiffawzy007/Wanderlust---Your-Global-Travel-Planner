const dashboard = document.getElementById("dashboard-view");
const holidays = document.getElementById("holidays-view");
const events = document.getElementById("events-view");
const weather = document.getElementById("weather-view");
const longWeekends = document.getElementById("long-weekends-view");
const currency = document.getElementById("currency-view");
const sunTimes = document.getElementById("sun-times-view");
const myPlans = document.getElementById("my-plans-view");
const globalCountry = document.getElementById("global-country");
const sidebarChildren = document.querySelectorAll(".nav-item");
let lastActiveEnd = document.getElementById("all");
let Explore = {
  countryCode: null,
  city: null,
  year: null,
  flagImg: null,
  countryName: null,
  latitude: null,
  longitude: null,
};
let mainPageData;
let neighborsData;
let lastOpenPage = dashboard;
let lastOpenNav = document.getElementById("mainNav");
let holidayIndex = 0;
let eventIndex = 0;

var plansData = JSON.parse(localStorage.getItem("Data")) || [];
if (plansData.length !== 0) {
  displaynumofsave();
}
function displaynumofsave() {
  document.getElementById("stat-saved").innerText = plansData.length;
  document.getElementById("plans-count").innerText = plansData.length;
  document.getElementById("plans-count").classList.remove("hidden");
  if (plansData.length == 0) {
    document.getElementById("plans-count").classList.add("hidden");
  }
}

for (let i = 0; i < sidebarChildren.length; i++) {
  sidebarChildren[i].addEventListener("click", function (e) {
    if (e.currentTarget.classList.contains("nav-item")) {
      close();
      open(e.currentTarget);
      lastOpenNav = e.currentTarget;
    }
  });
}
function save(x, data1, data2, data3, data4, typee) {
  if (typee == "Holiday") {
    var myData = {
      type: typee.toUpperCase(),
      name: data1,
      startDate: dateParts(data2),
      extra: data3,
      countryName: Explore.countryName,
      index: x,
    };
  } else if (typee == "Event") {
    var myData = {
      type: typee.toUpperCase(),
      name: data1,
      startDate: dateParts(data2),
      extra: data3,
      countryName: Explore.countryName,
      index: x,
    };
  } else {
    if (data4) {
      var myData = {
        type: typee.toUpperCase(),
        name: `${data1} Day Long Weekend`,
        startDate: dateParts(data2),
        endDate: dateParts(data3),
        extra: "Bridge day needed",
        countryName: Explore.countryName,
        index: x,
      };
    } else {
      var myData = {
        type: typee.toUpperCase(),
        name: `${data1} Day Long Weekend`,
        startDate: dateParts(data2),
        endDate: dateParts(data3),
        extra: "No extra days needed",
        countryName: Explore.countryName,
        index: x,
      };
    }
  }
  plansData.push(myData);
  localStorage.setItem("Data", JSON.stringify(plansData));
  displaynumofsave();
}
function openDashboard() {
  close();
  open(document.getElementById("mainNav"));
  lastOpenNav = document.getElementById("mainNav");
}
function loading() {
  document.getElementById("loading-overlay").classList.remove("hidden");
}
function stopLoading() {
  document.getElementById("loading-overlay").classList.add("hidden");
}

function dateParts(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const baseDate = new Date(Date.UTC(year, month - 1, day));

  const dayPlus1 = new Date(baseDate);
  dayPlus1.setUTCDate(baseDate.getUTCDate() + 1);

  const dayPlus2 = new Date(baseDate);
  dayPlus2.setUTCDate(baseDate.getUTCDate() + 2);

  const formatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });

  return {
    weekday: formatter.format(baseDate),
    weekday2: formatter.format(dayPlus1),
    weekday3: formatter.format(dayPlus2),
    day: +baseDate.getUTCDate(),
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      baseDate,
    ),
    year: baseDate.getUTCFullYear(),
  };
}
function datePartsWithTime(dateTimeString) {
  const [datePart, timePart] = dateTimeString.split("T");

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour24, minute] = timePart.split(":").map(Number);

  const baseDate = new Date(Date.UTC(year, month - 1, day, hour24, minute));

  const dayPlus1 = new Date(baseDate);
  dayPlus1.setUTCDate(baseDate.getUTCDate() + 1);

  const dayPlus2 = new Date(baseDate);
  dayPlus2.setUTCDate(baseDate.getUTCDate() + 2);

  const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  });
  const hourFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: true,
  });

  const hourString = hourFormatter.format(baseDate);
  const [hour, period] = hourString.split(" ");

  return {
    weekday: weekdayFormatter.format(baseDate),
    weekday2: weekdayFormatter.format(dayPlus1),
    weekday3: weekdayFormatter.format(dayPlus2),

    day: baseDate.getUTCDate(),
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      baseDate,
    ),
    year: baseDate.getUTCFullYear(),

    hour,
    minute,
    period,
  };
}
function dateSunRise(dateTimeString) {
  const date = new Date(dateTimeString);

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });

  const time = timeFormatter.format(date);
  const [hour, minuteWithPeriod] = time.split(":");
  const [minute, period] = minuteWithPeriod.split(" ");

  return {
    hour,
    minute,
    period,
    fullDate: dateFormatter.format(date),
    weekday: weekdayFormatter.format(date),
  };
}

function open(x) {
  x.classList.add("active");
  y = x.getAttribute("data-view");
  switch (y) {
    case "dashboard":
      lastOpenPage = dashboard;
      dashboard.classList.add("active");
      document.getElementById("page-title").innerText = "Dashboard";
      document.getElementById("page-subtitle").innerText =
        "Welcome back! Ready to plan your next adventure?";
        history.pushState(null, "", "/Dashboard");
      break;
    case "holidays":
      lastOpenPage = holidays;
      holidays.classList.add("active");
      document.getElementById("page-title").innerText = "Holidays";
      document.getElementById("page-subtitle").innerText =
        "Explore public holidays around the world";
      holiday();
        history.pushState(null, "", "/Holidays");

      break;
    case "events":
      lastOpenPage = events;
      events.classList.add("active");
      document.getElementById("page-title").innerText = "Events";
      document.getElementById("page-subtitle").innerText =
        "Find concerts, sports, and entertainment";
      Events();
        history.pushState(null, "", "/Events");

      break;
    case "weather":
      lastOpenPage = weather;
      weather.classList.add("active");
      document.getElementById("page-title").innerText = "Weather";
      document.getElementById("page-subtitle").innerText =
        "Check forecasts for any destination";
      weatherr();
        history.pushState(null, "", "/Weather");

      break;
    case "long-weekends":
      lastOpenPage = longWeekends;
      longWeekends.classList.add("active");
      document.getElementById("page-title").innerText = "Long Weekends";
      document.getElementById("page-subtitle").innerText =
        "Find the perfect mini-trip opportunities";
      longWeekend();
        history.pushState(null, "", "/LongWeekends");

      break;
    case "currency":
      lastOpenPage = currency;
      currency.classList.add("active");
      document.getElementById("page-title").innerText = "Currency";
      document.getElementById("page-subtitle").innerText =
        "Convert currencies with live exchange rates";
        history.pushState(null, "", "/Currency");

      break;
    case "sun-times":
      lastOpenPage = sunTimes;
      sunTimes.classList.add("active");
      document.getElementById("page-title").innerText = "Sun Times";
      document.getElementById("page-subtitle").innerText =
        "Check sunrise and sunset times worldwide";
      sunRiseData();
        history.pushState(null, "", "/SunTimes");

      break;
    case "my-plans":
      lastOpenPage = myPlans;
      myPlans.classList.add("active");
      document.getElementById("page-title").innerText = "My Plans";
      document.getElementById("page-subtitle").innerText =
        "Your saved holidays and events";
      displayAll();
      lastActiveEnd = document.getElementById("all");

        history.pushState(null, "", "/MyPlans");

      break;
  }
}
function close() {
  lastOpenPage.classList.remove("active");
  lastOpenNav.classList.remove("active");
}
function time() {
  const now = new Date();
  document.getElementById("current-datetime").innerText =
    new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(now);
}
setInterval(time, 60000);
time();
async function getCountries() {
  let response = await fetch("https://date.nager.at/api/v3/AvailableCountries");
  if (response.ok) {
    const data = await response.json();
    let cartona =
      '<option value="select" selected hidden>Select Country</option>';
    for (let i = 0; i < data.length; i++) {
      cartona += `<option value="${data[i].countryCode}">${data[i].countryCode} ${data[i].name}</option>`;
    }
    document.getElementById("global-country").innerHTML = cartona;
  }
}
let clockInterval = null;

function startClock(utcOffset) {
  function parseOffset(offset) {
    const sign = offset.includes("+") ? 1 : -1;
    const [hours, minutes] = offset.slice(4).split(":").map(Number);
    return sign * (hours * 60 + minutes);
  }

  const offsetMinutes = parseOffset(utcOffset);

  function updateTime() {
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const localTime = new Date(utcTime + offsetMinutes * 60000);

    const formatted = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(localTime);

    document.getElementById("country-local-time").innerText = formatted;
  }

  if (clockInterval !== null) {
    clearInterval(clockInterval);
  }

  updateTime();
  clockInterval = setInterval(updateTime, 1000);
}
getCountries();
async function getCountryData(code) {
  if (code) {
    let response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    if (response.ok) {
      const contryData = await response.json();
      let [Data] = contryData;
      return Data;
    }
  }
}
function displayCountryData(data) {
  document.getElementById("selected-country-flag").src = data.flags.png;
  document.getElementById("selected-country-flag").alt = data.name.common;
  document.getElementById("selected-country-name").innerText = data.name.common;
  document.getElementById("selected-city-name").innerText =
    `• ${data.capital[0]}`;
  document.getElementById("global-city-value").innerText =
    `${data.capital[0]}  (Capital)`;
}
function displayCountryDashboard(data) {
  document.getElementById("dashboard-country-info").classList.remove("hidden");
  document.getElementById("dashboard-country-Empty").classList.add("hidden");
  document.querySelector(".dashboard-country-header img").src = data.flags.png;
  document.querySelector(".dashboard-country-header h3").innerText =
    data.name.common;
  document.querySelector(".dashboard-country-header p").innerText =
    data.name.official;
  document.querySelector(".dashboard-country-header span").innerText =
    `${data.region} • ${data.subregion}`;
  document.querySelector(".local-time-zone").innerText = data.timezones[0];
  startClock(data.timezones[0]);
  document.querySelector(
    ".dashboard-country-grid .dashboard-country-detail:nth-child(1) .value",
  ).innerText = data.capital[0];
  document.querySelector(
    ".dashboard-country-grid .dashboard-country-detail:nth-child(2) .value",
  ).innerText = data.population;
  document.querySelector(
    ".dashboard-country-grid .dashboard-country-detail:nth-child(3) .value",
  ).innerText = data.area;
  document.querySelector(
    ".dashboard-country-grid .dashboard-country-detail:nth-child(4) .value",
  ).innerText = data.region;
  document.querySelector(
    ".dashboard-country-grid .dashboard-country-detail:nth-child(5) .value",
  ).innerText = data.idd.root + data.idd.suffixes[0];
  document.querySelector(
    ".dashboard-country-grid .dashboard-country-detail:nth-child(6) .value",
  ).innerText = data.car.side;
  document.querySelector(
    ".dashboard-country-grid .dashboard-country-detail:nth-child(7) .value",
  ).innerText = data.startOfWeek;
  Object.entries(data.currencies).forEach(([code, info]) => {
    document.querySelector(
      ".dashboard-country-extras .dashboard-country-extra:nth-child(1) .extra-tag",
    ).innerText = `${info.name} (${code} ${info.symbol})`;
  });
  let cartona = "";
  for (const [, value] of Object.entries(data.languages)) {
    cartona += `<span class="extra-tag">${value}</span>`;
  }
  document.querySelector(
    ".dashboard-country-extras .dashboard-country-extra:nth-child(2) .extra-tags",
  ).innerHTML = cartona;
  let cartonaaa = "";
  if (data.borders) {
    for (let i = 0; i < data.borders.length; i++) {
      cartonaaa += `<span class="extra-tag border-tag">${data.borders[i]}</span>`;
    }
  }
  document.querySelector(
    ".dashboard-country-extras .dashboard-country-extra:nth-child(3) .extra-tags",
  ).innerHTML = cartonaaa;
  document.querySelector(".dashboard-country-actions a").href =
    data.maps.googleMaps;
  var neighbors = document.querySelectorAll(".extra-tag.border-tag");
  for (let i = 0; i < neighbors.length; i++) {
    neighbors[i].addEventListener("click", async function (e) {
      neighborsData = await getCountryData(e.target.innerText);
      console.log(neighborsData);

      displayCountryDashboard(neighborsData);
    });
  }
}
globalCountry.addEventListener("change", async function () {
  mainPageData = await getCountryData(globalCountry.value);
  displayCountryData(mainPageData);
  document.getElementById("selected-destination").classList.remove("hidden");
});
document
  .getElementById("global-search-btn")
  .addEventListener("click", async function () {
    if (globalCountry.value !== "select") {
      displayCountryDashboard(mainPageData);
      Explore.countryCode = document.getElementById("global-country").value;
      Explore.city = mainPageData.capital;
      Explore.year = document.getElementById("global-year").value;
      Explore.flagImg = mainPageData.flags.png;
      Explore.countryName = mainPageData.name.common;
      let respons = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${mainPageData.capital}&count=1`,
      );
      if (respons.ok) {
        let locationData = await respons.json();
        Explore.latitude = locationData.results[0].latitude;
        Explore.longitude = locationData.results[0].longitude;
        console.log(Explore.longitude);
      }
    }
  });
document
  .getElementById("clear-selection-btn")
  .addEventListener("click", function () {
    document.getElementById("global-country").value = "select";
    document.getElementById("selected-destination").classList.add("hidden");
    document.getElementById("dashboard-country-info").classList.add("hidden");
    document
      .getElementById("dashboard-country-Empty")
      .classList.remove("hidden");
    document.getElementById("global-city-value").innerText = "Select City";
    Explore.countryCode = null;
    Explore.city = null;
    Explore.year = null;
    Explore.flagImg = null;
    Explore.countryName = null;
    Explore.latitude = null;
    Explore.longitude = null;
  });
async function getHolidays() {
  if (Explore.countryCode) {
    let response = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${Explore.year}/${Explore.countryCode}`,
    );
    if (response.ok) {
      let data = await response.json();
      return data;
    }
  }
}
async function holiday() {
  if (Explore.countryCode) {
    loading();
    let holidayData = await getHolidays();
    displayHolidayData(holidayData);
    stopLoading();
  } else {
    document.getElementById("holidays-content").innerHTML =
      `<div class="empty-state">
              <div class="empty-icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar-xmark" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar-xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M160 0c17.7 0 32 14.3 32 32V64H320V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H32V112c0-26.5 21.5-48 48-48h48V32c0-17.7 14.3-32 32-32zM32 192H480V464c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V192zM337 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47z"></path></svg></i></div>
              <h3>No Country Selected</h3>
              <p>Select a country from the dashboard to explore public holidays</p>
              <button class="btn btn-primary" onclick="openDashboard()">
                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"></path></svg></i>
                Go to Dashboard
              </button>
            </div>`;
  }
}
async function Events() {
  loading();
  await displayEventsData();
  stopLoading();
}
function displayHolidayData(Data) {
  let cartona = "";
  for (let i = 0; i < Data.length; i++) {
    let date = dateParts(Data[i].date);
    cartona += `<div class="holiday-card">
                <div class="holiday-card-header">
                  <div class="holiday-date-box">
                    <span class="day">${date.day}</span><span class="month">${date.month}</span>
                  </div>
                  <button id ="Mysave${i}" class="holiday-action-btn">
                    <i class="fa-regular fa-heart"></i>
                  </button>
                </div>
                <h3>${Data[i].localName}</h3>
                <p class="holiday-name">${Data[i].name}</p>
                <div class="holiday-card-footer">
                  <span class="holiday-day-badge"
                    ><i class="fa-regular fa-calendar"></i> ${date.weekday}</span
                  >
                  <span class="holiday-type-badge">Public</span>
                </div>
              </div>`;
  }
  document.getElementById("holidays-content").innerHTML = cartona;
  for (let i = 0; i < Data.length; i++) {
    document.getElementById(`Mysave${i}`).addEventListener("click", () => {
      save(
        i,
        `${Data[i].localName}`,
        `${Data[i].date}`,
        `${Data[i].name}`,
        0,
        "Holiday",
      );
    });
  }
}
async function getEvents() {
  const response = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?apikey=VwECw2OiAzxVzIqnwmKJUG41FbeXJk1y&city=${Explore.city}&countryCode=${Explore.countryCode}&size=20`,
  );
  if (response.ok) {
    const data = await response.json();
    return data;
  }
}
async function displayEventsData() {
  if (Explore.countryCode) {
    let data = await getEvents();
    if (!(data.page.totalElements == 0)) {
      let cartona = "";
      for (let i = 0; i < data._embedded.events.length; i++) {
        date = dateParts(data._embedded.events[i].dates.start.localDate);
        cartona += `<div class="event-card">
                <div class="event-card-image">
                  <img
                    src="${data._embedded.events[i].images[0].url}"
                    alt="${data._embedded.events[i]._embedded.venues[0].type}"
                  />
                  <span class="event-card-category">${data._embedded.events[i]._embedded.venues[0].type}</span>
                  <button onclick="save(${i}, '${data._embedded.events[i]._embedded.venues[0].name}','${data._embedded.events[i].dates.start.localDate}','${data._embedded.events[i]._embedded.venues[0].address.line1}',0, 'Event')" class="event-card-save">
                    <i class="fa-regular fa-heart"></i>
                  </button>
                </div>
                <div class="event-card-body">
                  <h3>${data._embedded.events[i]._embedded.venues[0].name}</h3>
                  <div class="event-card-info">
                    <div>
                      <i class="fa-regular fa-calendar"></i>${date.month} ${date.day}, ${date.year} at
                      ${data._embedded.events[i].dates.start.localTime}
                    </div>
                    <div>
                      <i class="fa-solid fa-location-dot"></i>>${data._embedded.events[i]._embedded.venues[0].address.line1},
                      ${data._embedded.events[i]._embedded.venues[0].city.name}
                    </div>
                  </div>
                  <div class="event-card-footer">
                    <button onclick="save(${i}, '${data._embedded.events[i]._embedded.venues[0].name}','${data._embedded.events[i].dates.start.localDate}','${data._embedded.events[i]._embedded.venues[0].address.line1}',0, 'Event')" class="btn-event">
                      <i class="fa-regular fa-heart"></i> Save
                    </button>
                    <a href="#${data._embedded.events[i].url}" class="btn-buy-ticket"
                      ><i class="fa-solid fa-ticket"></i> Buy Tickets</a
                    >
                  </div>
                </div>
              </div>`;
      }
      document.getElementById("events-content").innerHTML = cartona;
    } else {
      document.getElementById("events-content").innerHTML =
        `<div class="empty-state">
        <div class="empty-icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-ticket" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ticket" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V128c0-35.3-28.7-64-64-64H64zm64 112l0 160c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V160z"></path></svg></i></div>
        <h3>No Events Found</h3>
        <p>No events found for this location</p>
      </div>`;
    }
  } else {
    document.getElementById("events-content").innerHTML =
      `<div class="empty-state">
              <div class="empty-icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-ticket" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ticket" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V128c0-35.3-28.7-64-64-64H64zm64 112l0 160c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V160z"></path></svg></i></div>
              <h3>No City Selected</h3>
              <p>Select a country and city from the dashboard to discover events</p>
              <button class="btn btn-primary" onclick="openDashboard()">
                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"></path></svg></i>
                Go to Dashboard
              </button>
            </div>`;
  }
}
async function getLongWeekends() {
  let response = await fetch(
    `https://date.nager.at/api/v3/LongWeekend/${Explore.year}/${Explore.countryCode}`,
  );
  if (response.ok) {
    let data = await response.json();
    return data;
  }
}
async function displayLongWeekend() {
  if (Explore.countryCode) {
    let data = await getLongWeekends();

    let cartona = "";
    for (let i = 0; i < data.length; i++) {
      let startDate = dateParts(data[i].startDate);
      let endDate = dateParts(data[i].endDate);
      if (data[i].needBridgeDay) {
        cartona += `<div class="lw-card">
                <div class="lw-card-header">
                  <span class="lw-badge"
                    ><i class="fa-solid fa-calendar-days"></i> ${data[i].dayCount} Days</span
                  >
                  <button onclick="save(${i}, '${data[i].dayCount}','${data[i].startDate}','${data[i].endDate}',${data[i].needBridgeDay}, 'Long Weakend')" class="holiday-action-btn">
                    <i class="fa-regular fa-heart"></i>
                  </button>
                </div>
                <h3>Long Weekend #${i + 1}</h3>
                <div class="lw-dates">
                  <i class="fa-regular fa-calendar"></i> ${startDate.month} ${startDate.day} - ${endDate.month} ${endDate.day}, ${startDate.year}
                </div>
                <div class="lw-info-box warning">
          <i data-fa-i2svg=""><svg class="svg-inline--fa fa-circle-info" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-info" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></svg></i>
          Requires taking a bridge day off
        </div>
                <div class="lw-days-visual">
                  <div class="lw-day">
                    <span class="name">${startDate.weekday}</span><span class="num">${startDate.day}</span>
                  </div>
                  <div class="lw-day ">
                    <span class="name">${startDate.weekday2}</span><span class="num">${startDate.day + 1}</span>
                  </div>
                  <div class="lw-day ">
                    <span class="name">${startDate.weekday3}</span><span class="num">${startDate.day + 2}</span>
                  </div>
                  <div class="lw-day ">
                    <span class="name">${endDate.weekday}</span><span class="num">${endDate.day}</span>
                  </div>
                </div>
              </div>`;
      } else {
        cartona += `<div class="lw-card">
                <div class="lw-card-header">
                  <span class="lw-badge"
                    ><i class="fa-solid fa-calendar-days"></i> ${data.dayCount} Days</span
                  >
                  <button onclick="save(${i}, '${data[i].dayCount}','${data[i].startDate}','${data[i].endDate}',${data[i].needBridgeDay}, 'Long Weakend')" class="holiday-action-btn">
                    <i class="fa-regular fa-heart"></i>
                  </button>
                </div>
                <h3>Long Weekend #${i + 1}</h3>
                <div class="lw-dates">
                  <i class="fa-regular fa-calendar"></i> ${startDate.month} ${startDate.day} - ${endDate.month} ${endDate.day}, ${startDate.year}
                </div>
                <div class="lw-info-box success">
                  <i class="fa-solid fa-check-circle"></i> No extra days off
                  needed!
                </div>
                <div class="lw-days-visual">
                  <div class="lw-day">
                    <span class="name">${startDate.weekday}</span><span class="num">${startDate.day}</span>
                  </div>
                  <div class="lw-day ">
                    <span class="name">${startDate.weekday2}</span><span class="num">${startDate.day + 1}</span>
                  </div>
                  <div class="lw-day ">
                    <span class="name">${startDate.weekday3}</span><span class="num">${startDate.day + 2}</span>
                  </div>
                  <div class="lw-day ">
                    <span class="name">${endDate.weekday}</span><span class="num">${endDate.day}</span>
                  </div>
                </div>
              </div>`;
      }
      document.getElementById("lw-content").innerHTML = cartona;
    }
  } else {
    document.getElementById("lw-content").innerHTML = `<div class="empty-state">
              <div class="empty-icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-umbrella-beach" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="umbrella-beach" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M346.3 271.8l-60.1-21.9L214 448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H282.1l64.1-176.2zm121.1-.2l-3.3 9.1 67.7 24.6c18.1 6.6 38-4.2 39.6-23.4c6.5-78.5-23.9-155.5-80.8-208.5c2 8 3.2 16.3 3.4 24.8l.2 6c1.8 57-7.3 113.8-26.8 167.4zM462 99.1c-1.1-34.4-22.5-64.8-54.4-77.4c-.9-.4-1.9-.7-2.8-1.1c-33-11.7-69.8-2.4-93.1 23.8l-4 4.5C272.4 88.3 245 134.2 226.8 184l-3.3 9.1L434 269.7l3.3-9.1c18.1-49.8 26.6-102.5 24.9-155.5l-.2-6zM107.2 112.9c-11.1 15.7-2.8 36.8 15.3 43.4l71 25.8 3.3-9.1c19.5-53.6 49.1-103 87.1-145.5l4-4.5c6.2-6.9 13.1-13 20.5-18.2c-79.6 2.5-154.7 42.2-201.2 108z"></path></svg></i></div>
              <h3>No Country Selected</h3>
              <p>Select a country from the dashboard to discover long weekend opportunities</p>
              <button class="btn btn-primary" onclick="openDashboard()">
                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"></path></svg></i>
                Go to Dashboard
              </button>
            </div>`;
  }
}
async function longWeekend() {
  loading();
  await displayLongWeekend();
  stopLoading();
}
async function getWeather() {
  let respons = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${Explore.latitude}&longitude=${Explore.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`,
  );
  if (respons.ok) {
    let data = await respons.json();
    return data;
  }
}
async function displayWeather() {
  if (Explore.countryCode) {
    let data = await getWeather();
    let date = datePartsWithTime(data.current.time);

    document.querySelector(".weather-location span").innerText = Explore.city;
    document.querySelector(
      "#weather-content .weather-location .weather-time",
    ).innerText = `${date.weekday}, ${date.month} ${date.day}, ${date.year}`;
    switch (data.current.weather_code) {
      case 0:
      case 1:
        document.getElementById("myWeather").classList.add("weather-sunny");
        document
          .querySelector(".weather-hero-main .weather-hero-icon svg")
          .setAttribute("data-icon", "sun");
        document.querySelector(
          ".weather-hero-right .weather-condition",
        ).innerText = "Sunny";
        break;
      case 2:
      case 3:
        document.getElementById("myWeather").classList.add("weather-cloudy");
        document
          .querySelector(".weather-hero-main .weather-hero-icon svg")
          .setAttribute("data-icon", "cloud-sun");
        document.querySelector(
          ".weather-hero-right .weather-condition",
        ).innerText = "Cloudy";
        break;
      case 45:
      case 48:
        document.getElementById("myWeather").classList.add("weather-cloudy");
        document
          .querySelector(".weather-hero-main .weather-hero-icon svg")
          .setAttribute("data-icon", "cloud");
        document.querySelector(
          ".weather-hero-right .weather-condition",
        ).innerText = "Fog";
        break;
      case 51:
      case 53:
      case 55:
        document.getElementById("myWeather").classList.add("weather-rainy");
        document
          .querySelector(".weather-hero-main .weather-hero-icon svg")
          .setAttribute("data-icon", "cloud-rain");
        document.querySelector(
          ".weather-hero-right .weather-condition",
        ).innerText = "Drizzle";
        break;
      case 61:
      case 63:
      case 65:
        document.getElementById("myWeather").classList.add("weather-rainy");
        document
          .querySelector(".weather-hero-main .weather-hero-icon svg")
          .setAttribute("data-icon", "cloud-showers-heavy");
        document.querySelector(
          ".weather-hero-right .weather-condition",
        ).innerText = "Rain";
        break;
      case 71:
      case 73:
      case 75:
        document.getElementById("myWeather").classList.add("weather-stormy");
        document
          .querySelector(".weather-hero-main .weather-hero-icon svg")
          .setAttribute("data-icon", "cloud-showers-heavy");
        document.querySelector(
          ".weather-hero-right .weather-condition",
        ).innerText = "Snow fall";
        break;
      case 80:
      case 81:
      case 82:
        document.getElementById("myWeather").classList.add("weather-stormy");
        document
          .querySelector(".weather-hero-main .weather-hero-icon svg")
          .setAttribute("data-icon", "cloud-showers-heavy");
        document.querySelector(
          ".weather-hero-right .weather-condition",
        ).innerText = "Rain showers";
        break;
      case 95:
      case 96:
      case 99:
        document.getElementById("myWeather").classList.add("weather-stormy");
        document
          .querySelector(".weather-hero-main .weather-hero-icon svg")
          .setAttribute("data-icon", "cloud-showers-heavy");
        document.querySelector(
          ".weather-hero-right .weather-condition",
        ).innerText = "Thunderstorm";
        break;
    }
    document.querySelector(".weather-hero-temp .temp-value").innerText =
      Math.floor(data.current.temperature_2m);
    document.querySelector(".weather-hero-right .weather-feels").innerText =
      `Feels like ${Math.floor(data.current.apparent_temperature)}°C`;
    document.querySelector(".weather-high-low .high").innerHTML =
      `<i class="fa-solid fa-arrow-up"></i> ${Math.floor(data.daily.temperature_2m_max[0])}°`;
    document.querySelector(".weather-high-low .low").innerHTML =
      `<i class="fa-solid fa-arrow-down"></i> ${Math.floor(data.daily.temperature_2m_min[0])}°`;
    document.querySelector(
      ".weather-details-grid .weather-detail-card:nth-child(1) .detail-value",
    ).innerText = `${Math.floor(data.current.relative_humidity_2m)}%`;
    document.querySelector(
      ".weather-details-grid .weather-detail-card:nth-child(2) .detail-value",
    ).innerText = `${Math.floor(data.current.wind_direction_10m)} km/h`;
    document.querySelector(
      ".weather-details-grid .weather-detail-card:nth-child(3) .detail-value",
    ).innerText = `${Math.floor(data.current.uv_index)}`;
    document.querySelector(
      ".weather-details-grid .weather-detail-card:nth-child(4) .detail-value",
    ).innerText = `${Math.floor(data.daily.precipitation_probability_max[0])}%`;
    let x = +Math.floor(date.hour);
    if (date.period == "PM") {
      x += 12;
    }
    for (let i = 1; i < 25; i++) {
      let hourlyDate = datePartsWithTime(data.hourly.time[x]);
      switch (data.hourly.weather_code[x]) {
        case 0:
        case 1:
          document
            .querySelector(
              `.hourly-scroll .hourly-item:nth-child(${i}) .hourly-icon svg`,
            )
            .setAttribute("data-icon", "sun");
          break;
        case 2:
        case 3:
          document
            .querySelector(
              `.hourly-scroll .hourly-item:nth-child(${i}) .hourly-icon svg`,
            )
            .setAttribute("data-icon", "cloud-sun");
          break;
        case 45:
        case 48:
          document
            .querySelector(
              `.hourly-scroll .hourly-item:nth-child(${i}) .hourly-icon svg`,
            )
            .setAttribute("data-icon", "cloud");
          break;
        case 51:
        case 53:
        case 55:
          document
            .querySelector(
              `.hourly-scroll .hourly-item:nth-child(${i}) .hourly-icon svg`,
            )
            .setAttribute("data-icon", "cloud-rain");
          break;
        case 61:
        case 63:
        case 65:
          document
            .querySelector(
              `.hourly-scroll .hourly-item:nth-child(${i}) .hourly-icon svg`,
            )
            .setAttribute("data-icon", "cloud-showers-heavy");
          break;
        case 71:
        case 73:
        case 75:
          document
            .querySelector(
              `.hourly-scroll .hourly-item:nth-child(${i}) .hourly-icon svg`,
            )
            .setAttribute("data-icon", "cloud-showers-heavy");

          break;
        case 80:
        case 81:
        case 82:
          document
            .querySelector(
              `.hourly-scroll .hourly-item:nth-child(${i}) .hourly-icon svg`,
            )
            .setAttribute("data-icon", "cloud-showers-heavy");

          break;
        case 95:
        case 96:
        case 99:
          document
            .querySelector(
              `.hourly-scroll .hourly-item:nth-child(${i}) .hourly-icon svg`,
            )
            .setAttribute("data-icon", "cloud-showers-heavy");

          break;
      }
      if (!(i == 1)) {
        document.querySelector(
          `.hourly-scroll .hourly-item:nth-child(${i}) .hourly-time`,
        ).innerText = `${hourlyDate.hour} ${hourlyDate.period}`;
      }
      document.querySelector(
        `.hourly-scroll .hourly-item:nth-child(${i}) .hourly-temp`,
      ).innerText = `${Math.floor(data.hourly.temperature_2m[x])}°`;
      x++;
    }

    for (let i = 1; i < 8; i++) {
      var dailyDate = dateParts(data.daily.time[i - 1]);
      switch (data.daily.weather_code[i - 1]) {
        case 0:
        case 1:
          document
            .querySelector(
              `.forecast-list .forecast-day:nth-child(${i}) .forecast-icon svg`,
            )
            .setAttribute("data-icon", "sun");
          break;
        case 2:
        case 3:
          document
            .querySelector(
              `.forecast-list .forecast-day:nth-child(${i}) .forecast-icon svg`,
            )
            .setAttribute("data-icon", "cloud-sun");
          break;
        case 45:
        case 48:
          document
            .querySelector(
              `.forecast-list .forecast-day:nth-child(${i}) .forecast-icon svg`,
            )
            .setAttribute("data-icon", "cloud");
          break;
        case 51:
        case 53:
        case 55:
          document
            .querySelector(
              `.forecast-list .forecast-day:nth-child(${i}) .forecast-icon svg`,
            )
            .setAttribute("data-icon", "cloud-rain");
          break;
        case 61:
        case 63:
        case 65:
          document
            .querySelector(
              `.forecast-list .forecast-day:nth-child(${i}) .forecast-icon svg`,
            )
            .setAttribute("data-icon", "cloud-showers-heavy");
          break;
        case 71:
        case 73:
        case 75:
          document
            .querySelector(
              `.forecast-list .forecast-day:nth-child(${i}) .forecast-icon svg`,
            )
            .setAttribute("data-icon", "cloud-showers-heavy");
          break;
        case 80:
        case 81:
        case 82:
          document
            .querySelector(
              `.forecast-list .forecast-day:nth-child(${i}) .forecast-icon svg`,
            )
            .setAttribute("data-icon", "cloud-showers-heavy");
          break;
        case 95:
        case 96:
        case 99:
          document
            .querySelector(
              `.forecast-list .forecast-day:nth-child(${i}) .forecast-icon svg`,
            )
            .setAttribute("data-icon", "cloud-showers-heavy");
          break;
      }
      if (!(i == 1)) {
        document.querySelector(
          `.forecast-list .forecast-day:nth-child(${i}) .day-label`,
        ).innerText = dailyDate.weekday;
      }
      document.querySelector(
        `.forecast-list .forecast-day:nth-child(${i}) .day-date`,
      ).innerText = `${dailyDate.day} ${dailyDate.month}`;
      document.querySelector(
        `.forecast-list .forecast-day:nth-child(${i}) .temp-max`,
      ).innerText = `${Math.floor(data.daily.temperature_2m_max[i - 1])}°`;
      document.querySelector(
        `.forecast-list .forecast-day:nth-child(${i}) .temp-min`,
      ).innerText = `${Math.floor(data.daily.temperature_2m_min[i - 1])}°`;
    }
  } else {
    document.getElementById("weather-content").innerHTML =
      `<div class="empty-state">
              <div class="empty-icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-cloud-question" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cloud-question" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><g class="missing"><path fill="currentColor" d="M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"></path><circle fill="currentColor" cx="256" cy="364" r="28"><animate attributeType="XML" repeatCount="indefinite" dur="2s" attributeName="r" values="28;14;28;28;14;28;"></animate><animate attributeType="XML" repeatCount="indefinite" dur="2s" attributeName="opacity" values="1;0;1;1;0;1;"></animate></circle><path fill="currentColor" opacity="1" d="M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"><animate attributeType="XML" repeatCount="indefinite" dur="2s" attributeName="opacity" values="1;0;0;0;0;1;"></animate></path><path fill="currentColor" opacity="0" d="M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"><animate attributeType="XML" repeatCount="indefinite" dur="2s" attributeName="opacity" values="0;0;1;1;0;0;"></animate></path></g></svg></i></div>
              <h3>No City Selected</h3>
              <p>Select a country and city from the dashboard to see the weather forecast</p>
              <button class="btn btn-primary" onclick="openDashboard()">
                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"></path></svg></i>
                Go to Dashboard
              </button>
            </div>`;
  }
}
async function weatherr() {
  loading();
  await displayWeather();
  stopLoading();
}
async function getSunRiseData() {
  let respons = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${Explore.latitude}&lng=${Explore.longitude}&date=2026-01-25&formatted=0`,
  );
  if (respons.ok) {
    let data = await respons.json();
    return data;
  }
}
async function displaySunRiseData() {
  if (Explore.countryCode) {
    let data = await getSunRiseData();
    let sunRiseDate = dateSunRise(data.results.sunrise);
    let sunSetDate = dateSunRise(data.results.sunset);
    let solarNoonDate = dateSunRise(data.results.solar_noon);
    let dawnBigenDate = dateSunRise(data.results.civil_twilight_begin);
    let duskEndDate = dateSunRise(data.results.civil_twilight_end);
    let daylight = data.results.day_length / 60 / 60;
    console.log(data.results.day_length);

    document.querySelector(".sun-location h2").innerText = Explore.city;
    document.querySelector(".sun-date-display .date").innerText =
      sunRiseDate.fullDate;
    document.querySelector(".sun-date-display .day").innerText =
      sunRiseDate.weekday;
    document.querySelector(".dawn .time").innerText =
      `${dawnBigenDate.hour}:${dawnBigenDate.minute} ${dawnBigenDate.period}`;
    document.querySelector(".dusk .time").innerText =
      `${duskEndDate.hour}:${duskEndDate.minute} ${duskEndDate.period}`;
    document.querySelector(".sunrise .time").innerText =
      `${sunRiseDate.hour}:${sunRiseDate.minute} ${sunRiseDate.period}`;
    document.querySelector(".sunset .time").innerText =
      `${sunSetDate.hour}:${sunSetDate.minute} ${sunSetDate.period}`;
    document.querySelector(".noon .time").innerText =
      `${solarNoonDate.hour}:${solarNoonDate.minute} ${solarNoonDate.period}`;
    document.querySelector(".daylight .time").innerText =
      `${Math.floor(daylight)}h ${Math.floor((daylight - Math.floor(daylight)) * 60)}m`;
    document.querySelector(
      ".day-length-stats .day-stat:nth-child(1) .value",
    ).innerText =
      `${Math.floor(daylight)}h ${Math.floor((daylight - Math.floor(daylight)) * 60)}m`;
    document.querySelector(
      ".day-length-stats .day-stat:nth-child(2) .value",
    ).innerText = `${Number(((daylight / 24) * 100).toFixed(1))}%`;
    document.querySelector(
      ".day-length-stats .day-stat:nth-child(3) .value",
    ).innerText =
      `${Math.floor(24 - daylight)}h ${60 - Math.floor((daylight - Math.floor(daylight)) * 60)}m`;
    document.querySelector(".day-progress-bar .day-progress-fill").style =
      `width: ${(daylight / 24) * 100}%`;
  } else {
    document.getElementById("sun-times-content").innerHTML =
      `<div class="empty-state">
              <div class="empty-icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-sun" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sun" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"></path></svg></i></div>
              <h3>No City Selected</h3>
              <p>Select a country and city from the dashboard to see sunrise and sunset times</p>
              <button class="btn btn-primary" onclick="openDashboard()">
                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"></path></svg></i>
                Go to Dashboard
              </button>
            </div>`;
  }
}
async function sunRiseData() {
  loading();
  await displaySunRiseData();
  stopLoading();
}
function displayAll() {
  eventIndex = 0;
  holidayIndex = 0;
  var cartona = "";
  lastActiveEnd.classList.remove("active");
  document.getElementById("all").classList.add("active");
  lastActiveEnd = document.getElementById("all");
  for (let i = 0; i < plansData.length; i++) {
    if (plansData[i].type == "HOLIDAY") {
      holidayIndex++;
      cartona += `<div class="plan-card">
        <span class="plan-card-type holiday">Holiday</span>
        <div class="plan-card-content">
          
        <h4>${plansData[i].name}</h4>
        <div class="plan-card-details">
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar" aria-hidden="true" focusable="false" data-prefix="far" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"></path></svg></i>${plansData[i].startDate.month} ${plansData[i].startDate.day}, ${plansData[i].startDate.year}</div>
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-circle-info" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-info" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></svg></i>${plansData[i].extra}</div>
        </div>
      
          <div class="plan-card-actions">
            <button class="btn-plan-remove" onclick="deleteOne(${i}, 'a')">
              <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></i> Remove
            </button>
          </div>
        </div>
      </div>`;
    } else if (plansData[i].type == "EVENT") {
      eventIndex++;
      cartona += `<div class="plan-card">
        <span class="plan-card-type event">Event</span>
        <div class="plan-card-content">
          
        <h4>${plansData[i].name}</h4>
        <div class="plan-card-details">
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar" aria-hidden="true" focusable="false" data-prefix="far" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"></path></svg></i>${plansData[i].startDate.month} ${plansData[i].startDate.day}, ${plansData[i].startDate.year}</div>
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-location-dot" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-dot" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></svg></i>${plansData[i].extra}</div>
        </div>
      
          <div class="plan-card-actions">
            <button class="btn-plan-remove" onclick="deleteOne(${i}, 'a')">
              <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></i> Remove
            </button>
          </div>
        </div>
      </div>`;
    } else {
      cartona += `<div class="plan-card">
        <span class="plan-card-type longweekend">Long Weekend</span>
        <div class="plan-card-content">
          
        <h4>${plansData[i].name}</h4>
        <div class="plan-card-details">
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar" aria-hidden="true" focusable="false" data-prefix="far" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"></path></svg></i>${plansData[i].startDate.month} ${plansData[i].startDate.day}, ${plansData[i].startDate.year} - ${plansData[i].endDate.month} ${plansData[i].endDate.day}, ${plansData[i].endDate.year}</div>
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-circle-info" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-info" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></svg></i>${plansData[i].extra}</div>
        </div>
      
          <div class="plan-card-actions">
            <button class="btn-plan-remove" onclick="deleteOne(${i}, 'a')">
              <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></i> Remove
            </button>
          </div>
        </div>
      </div>`;
    }
  }
  if (plansData.length) {
    document.getElementById("plans-content").innerHTML = cartona;
  } else {
    document.getElementById("plans-content").innerHTML =
      `<div class="empty-state">
                <div class="empty-icon">
                  <i class="fa-solid fa-heart-crack"></i>
                </div>
                <h3>No Saved Plans Yet</h3>
                <p>
                  Start exploring and save holidays, events, or long weekends
                  you like!
                </p>
                <button onclick="openDashboard()" class="btn-primary" id="start-exploring-btn">
                  <i class="fa-solid fa-compass"></i> Start Exploring
                </button>
              </div>`;
  }
  document.getElementById("filter-all-count").innerText = plansData.length;
  document.getElementById("filter-holiday-count").innerText = holidayIndex;
  document.getElementById("filter-event-count").innerText = eventIndex;
  document.getElementById("filter-lw-count").innerText =
    plansData.length - (holidayIndex + eventIndex);
}
function displayHolidayEnd() {
  let cartona = "";
  lastActiveEnd.classList.remove("active");
  document.getElementById("holiday").classList.add("active");
  lastActiveEnd = document.getElementById("holiday");
  for (let i = 0; i < plansData.length; i++) {
    if (plansData[i].type == "HOLIDAY") {
      cartona += `<div class="plan-card">
        <span class="plan-card-type holiday">Holiday</span>
        <div class="plan-card-content">
          
        <h4>${plansData[i].name}</h4>
        <div class="plan-card-details">
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar" aria-hidden="true" focusable="false" data-prefix="far" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"></path></svg></i>${plansData[i].startDate.month} ${plansData[i].startDate.day}, ${plansData[i].startDate.year}</div>
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-circle-info" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-info" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></svg></i>${plansData[i].extra}</div>
        </div>
      
          <div class="plan-card-actions">
            <button class="btn-plan-remove" onclick="deleteOne(${i}, 'h')">
              <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></i> Remove
            </button>
          </div>
        </div>
      </div>`;
    }
  }
  if (holidayIndex) {
    document.getElementById("plans-content").innerHTML = cartona;
  } else {
    document.getElementById("plans-content").innerHTML =
      `<div class="empty-state">
                <div class="empty-icon">
                  <i class="fa-solid fa-heart-crack"></i>
                </div>
                <h3>No Saved Plans Yet</h3>
                <p>
                  Start exploring and save holidays, events, or long weekends
                  you like!
                </p>
                <button onclick="openDashboard()" class="btn-primary" id="start-exploring-btn">
                  <i class="fa-solid fa-compass"></i> Start Exploring
                </button>
              </div>`;
  }
}
function displayEventEnd() {
  let cartona = "";
  lastActiveEnd.classList.remove("active");
  document.getElementById("event").classList.add("active");
  lastActiveEnd = document.getElementById("event");
  for (let i = 0; i < plansData.length; i++) {
    if (plansData[i].type == "EVENT") {
      cartona += `<div class="plan-card">
        <span class="plan-card-type event">Event</span>
        <div class="plan-card-content">
          
        <h4>${plansData[i].name}</h4>
        <div class="plan-card-details">
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar" aria-hidden="true" focusable="false" data-prefix="far" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"></path></svg></i>${plansData[i].startDate.month} ${plansData[i].startDate.day}, ${plansData[i].startDate.year}</div>
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-location-dot" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-dot" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></svg></i>${plansData[i].extra}</div>
        </div>
      
          <div class="plan-card-actions">
            <button class="btn-plan-remove" onclick="deleteOne(${i}, 'e')">
              <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></i> Remove
            </button>
          </div>
        </div>
      </div>`;
    }
  }
  if (eventIndex) {
    document.getElementById("plans-content").innerHTML = cartona;
  } else {
    document.getElementById("plans-content").innerHTML =
      `<div class="empty-state">
                <div class="empty-icon">
                  <i class="fa-solid fa-heart-crack"></i>
                </div>
                <h3>No Saved Plans Yet</h3>
                <p>
                  Start exploring and save holidays, events, or long weekends
                  you like!
                </p>
                <button onclick="openDashboard()" class="btn-primary" id="start-exploring-btn">
                  <i class="fa-solid fa-compass"></i> Start Exploring
                </button>
              </div>`;
  }
}
function displayLWEnd() {
  var cartona = "";
  lastActiveEnd.classList.remove("active");
  document.getElementById("longweekend").classList.add("active");
  lastActiveEnd = document.getElementById("longweekend");
  for (let i = 0; i < plansData.length; i++) {
    if (plansData[i].type == "LONG WEAKEND") {
      cartona += `<div class="plan-card">
        <span class="plan-card-type longweekend">Long Weekend</span>
        <div class="plan-card-content">
          
        <h4>${plansData[i].name}</h4>
        <div class="plan-card-details">
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar" aria-hidden="true" focusable="false" data-prefix="far" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"></path></svg></i>${plansData[i].startDate.month} ${plansData[i].startDate.day}, ${plansData[i].startDate.year} - ${plansData[i].endDate.month} ${plansData[i].endDate.day}, ${plansData[i].endDate.year}</div>
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-circle-info" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-info" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></svg></i>${plansData[i].extra}</div>
        </div>
      
          <div class="plan-card-actions">
            <button class="btn-plan-remove" onclick="deleteOne(${i}, 'l')">
              <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></i> Remove
            </button>
          </div>
        </div>
      </div>`;
    }
  }
  if (plansData.length - (eventIndex + holidayIndex)) {
    document.getElementById("plans-content").innerHTML = cartona;
  } else {
    document.getElementById("plans-content").innerHTML =
      `<div class="empty-state">
                <div class="empty-icon">
                  <i class="fa-solid fa-heart-crack"></i>
                </div>
                <h3>No Saved Plans Yet</h3>
                <p>
                  Start exploring and save holidays, events, or long weekends
                  you like!
                </p>
                <button onclick="openDashboard()" class="btn-primary" id="start-exploring-btn">
                  <i class="fa-solid fa-compass"></i> Start Exploring
                </button>
              </div>`;
  }
}
document.getElementById("all").addEventListener("click", () => {
  displayAll();
});
document.getElementById("holiday").addEventListener("click", () => {
  displayHolidayEnd();
});
document.getElementById("event").addEventListener("click", () => {
  displayEventEnd();
});
document.getElementById("longweekend").addEventListener("click", () => {
  displayLWEnd();
});
function deleteOne(num, x) {
  Swal.fire({
    title: "Remove Plan?",
    text: "Are you sure you want to remove this plan?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#EF4444",
    cancelButtonColor: "#5A687D",
    confirmButtonText: "Yes, remove it!",
  }).then((result) => {
    if (result.isConfirmed) {
      plansData.splice(num, 1);
      localStorage.setItem("Data", JSON.stringify(plansData));
      displaynumofsave();
      if (x == "h") {
        displayAll();
        displayHolidayEnd();
      } else if (x == "e") {
        displayAll();
        displayEventEnd();
      } else if (x == "a") {
        displayAll();
      } else {
        displayAll();
        displayLWEnd();
      }
      Swal.fire({
        title: "Removed!",
        text: "The plan has been removed.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}
function deleteAll() {
  plansData = [];
  localStorage.setItem("Data", JSON.stringify(plansData));
  displaynumofsave();
}
document.getElementById("clear-all-plans-btn").addEventListener("click", () => {
  if (plansData.length) {
    Swal.fire({
      title: "Clear All Plans?",
      text: "This will permanently delete all your saved plans. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#5A687D",
      confirmButtonText: "Yes, clear all!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAll();
        displayAll();
        Swal.fire({
          title: "Cleared!",
          text: "All your plans have been removed.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  } else {
    Swal.fire({
      title: "No Plans",
      text: "There are no saved plans to clear.",
      icon: "info",
      showCancelButton: false,
      confirmButtonColor: "#3B82F6",
      confirmButtonText: "OK",
    });
  }
});
