
const apiKey = "&appid=62ca58f933f1fcecfd39451eb3a258c2"

// need function to get text from input box 
// and have it produce a useable string for apicall

function getCity(event){
    event.preventDefault()
    let input = document.querySelector('#citySearch')
    let cityName = input.value
    console.log(cityName);
    getCoords(cityName);
} 

// function to call geolocation api to get coordinates
// have it call "getforecast" with those coordinates as arguments
function getCoords(city){
    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${1}${apiKey}`

fetch(apiUrl)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    console.log(data);
    parseCoords(data);
    });   
}

function parseCoords(data){
const lat = data[0].lat
const lon = data[0].lon
console.log(lat)
console.log(lon)
getForecast(lat,lon)
} 
// function to make variables



function getForecast(lat, lon) {
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly${apiKey}`;

    fetch(url)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    console.log(data);
    });   
}


        let parseWeather = function(weatherText) {
            let dailyForecast = weatherJSON.daily;
            console.log(dailyForecast);
            for (i = 0; i < dailyForecast.length; i++) {
                let day = dailyForecast[i];
                let description = day.weather[0].description;
                let icon = day.weather[0].icon;
                let highTemp = changetoFar(day.temp.max);
                let humidity = day.humidity;
                let windSpeed = day.wind_speed;
                let uvi = day.uvi;
                displayWeatherDay(dayOfWeek, description, icon, highTemp, humidity, windSpeed, uvi);
            }
        }

        let displayWeatherDay = function(dayOfWeek, description, icon, highTemp, humidity, windSpeed, uvi) {
            let out = "<div class='weatherDay'><img src='http://openweathermap.org/img/wn/" + icon + ".png'/>";
            out += "<h2>" + dayOfWeek + "</h2>";
            out += "<h3>" + description + "</h3>";
            out += "<p>High Temperature: " + highTemp + "F</p>";
            out += "<p>Humidity: " + humidity + "%</p>";
            out += "<p>Wind Speed: " + Math.round(windSpeed) + "</p></div>";
            out += "<p>UV Index: " + uvi + "</p></div>";
            document.getElementById("forecast").innerHTML += out;

        }
        

        // something to think about when making the elements that hold the forecast
        // example, not actual code
        // function displayForecasts()
        // for (let i = 0; i < 5; i++){
        //     displayforecast(weather[i])
        // }


        let getDayOfWeek = function(dayNum) {
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";

            return (weekday[dayNum]);
        }

        let timestampToTime = function(timeStamp) {
            let date = new Date(timeStamp * 1000);
            let hours = date.getHours();
            let minutes = "";
            if (date.getMinutes() < 10) {
                minutes = "0" + date.getMinutes();
            } else {
                minutes = date.getMinutes();
            }
            return hours + ":" + minutes;
        }
        document.getElementById("button").addEventListener("click", function (event) {
            getCity(event)
        });