let weatherObject = {
  "coord": {
      "lon": -74.3236,
      "lat": 40.398
  },
  "weather": [
      {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01d"
      }
  ],
  "base": "stations",
  "main": {
      "temp": 32.86,
      "feels_like": 28.08,
      "temp_min": 30.49,
      "temp_max": 35.64,
      "pressure": 1027,
      "humidity": 51
  },
  "visibility": 10000,
  "wind": {
      "speed": 5.01,
      "deg": 306,
      "gust": 8.99
  },
  "clouds": {
      "all": 0
  },
  "dt": 1676734338,
  "sys": {
      "type": 2,
      "id": 2036056,
      "country": "US",
      "sunrise": 1676720841,
      "sunset": 1676759726
  },
  "timezone": -18000,
  "id": 5096031,
  "name": "Brownville",
  "cod": 200
}


/**
 * Get approximate location
 * source https://www.geolocation-db.com/documentation
 * @param {object} data 
 */

function callback(data) {
  console.log("🚀 ~ file: script.js:8 ~ callback ~ data", data)
  getResults(data.latitude, data.longitude, false);
}

function getApproximateLocation () {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://geolocation-db.com/jsonp';
  var h = document.getElementsByTagName('script')[0];
  h.parentNode.insertBefore(script, h);
}

/**
* Allow the browser to get your location 
* source 
* https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/longitude
*/
var locationBtn = document.getElementById("get-location");

locationBtn.addEventListener("click", () => {

  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    console.log("🚀 ~ file: script.js:35 ~ navigator.geolocation.getCurrentPosition ~ lat", lat)
    let long = position.coords.longitude;
    console.log("🚀 ~ file: script.js:37 ~ navigator.geolocation.getCurrentPosition ~ long", long)
    // Pass current latitude and longitude to function that will handle API request
    getResults(lat, long, false);
  });
});

/**
 * Check to make sure user entered text into field
 * If field is not empty pass it's value to function that handle API request
 */
searchBtn.addEventListener('click', function () {

  var query = searchText.value;
  
  if (query) {
    searchText.value = "";
    getCoordinates(query);
  } else {
    alert("Search value cannot be blank")
  }
})

/**
 * Pass users query and attempt to get coordinates from API call
 * @param {string} searchQuery 
 */
function getCoordinates(searchQuery) {

  const apiUrlQuery = 'https://api.openweathermap.org/geo/1.0/direct?q=' + searchQuery + '&limit=5&appid=e97ee8621afbdf55e3cfc6d7bc09d848'

  fetch(apiUrlQuery)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw (error);
      }
    }).then(function (data) {
      console.log("🚀 ~ file: script.js:116 ~ data", data)
      //! Test pass first results to open weather
      searchedCity = data[0].name;
      searchedState = data[0].state;
      searchedCountry = data[0].country;
      getResults(data[0].lat, data[0].lon, true)
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather");
      console.log(error);
    });
};


function getResults(lat, long, updateFavorites) {


  const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='
    + lat + '&lon=' + long
    + '&appid=e97ee8621afbdf55e3cfc6d7bc09d848'

  // let apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?id=paris,fr&appid=e97ee8621afbdf55e3cfc6d7bc09d848'
  const apiUrl2 = 'https://api.openweathermap.org/data/2.5/forecast?id=Matawan,NJ,US&appid=e97ee8621afbdf55e3cfc6d7bc09d848'
  // let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=e97ee8621afbdf55e3cfc6d7bc09d848'


  // current weather        
  const currentApi = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&lang=en&appid=e97ee8621afbdf55e3cfc6d7bc09d848&units=imperial';

  // var docBody = document.getElementById('container')
  // docBody.appendChild(mapPic)

  //! http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}
  //! API call to get geo coordinates to pass into forcast call

  // fetch(apiUrl)
  fetch(currentApi)
    .then(function (response) {
      console.log("🚀 ~ file: script.js:125 ~ response", response)
      // console.log(response)
      if (response.ok) {
        response.json().then(function (data) {
          // console.log(data);          
          if (updateFavorites) {
            favoritesArray.push(data.name);
            updateLocalStorage();
            renderLocalStorage();
          }
          renderResults(data);
        })
      } else {
        alert('Error: ' + response.status)
      }
    })
}


/**
 * Update elements on the page
 * @param {object} data 
 */
function renderResults(data) {
console.log("🚀 ~ file: script.js:175 ~ renderResults ~ data", data)

  
  currentCity.textContent = data.name;
  // currentState.textContent = searchedState;
  currentCountry.textContent = data.sys.country;
  currentWeatherIcon.setAttribute('alt', "weather icon");
  currentWeatherIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png')
  currentDesc.textContent = data.weather[0].description;
  currentHigh.textContent = Math.round(data.main.temp_max);
  currentLow.textContent = Math.round(data.main.temp_min);
  currentTemp.textContent = Math.round(data.main.temp);
  currentFeelsLike.textContent = Math.round(data.main.feels_like);
  currentHumidity.textContent = data.main.humidity;
  currentPressure.textContent = data.main.pressure;



  

}


/**
 * Search favorites
 */

favoritesContainer.addEventListener('click', function (event) {
  const element = event.target;

  if (element.matches('i') === true) {
    const index = element.parentElement.getAttribute("data-index");
    favoritesArray.splice(index, 1);


    updateLocalStorage();
    renderLocalStorage();
  }

})

//todo if no lat or long / check for localstorate and use last location searched, if not local storage display modal with search - first time after user load the page
//todo update local storage
//todo render local storage
function updateLocalStorage() {
  localStorage.setItem("favorites", JSON.stringify(favoritesArray));
}


function renderLocalStorage() {
  favoritesList.innerHTML = "";

  favoritesArray = JSON.parse(localStorage.getItem("favorites"));

  if (favoritesArray) {
    favoritesArray.forEach((element, index) => {
      const favoritesListItem = document.createElement('li')
      favoritesListItem.setAttribute('data-index', index);
      favoritesListItem.setAttribute('class', 'my-2')
      favoritesListItem.textContent = element;
      const closeIcon = document.createElement('i');
      closeIcon.setAttribute('class', 'fa-solid fa-xmark btn');
      

      favoritesListItem.appendChild(closeIcon);
      favoritesList.appendChild(favoritesListItem)
    });
  } else {
    favoritesArray = [];
  }
}



getApproximateLocation();
renderLocalStorage();
