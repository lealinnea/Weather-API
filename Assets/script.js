// using the date prototype to add days 
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var dateString = mm + '/' + dd + '/' + yyyy;

    return dateString;
}


// main function to get the weather data 
function getWeatherData(){
    console.log("GET WEATHER")
    fromSearchHistory = false
    var searchHistoryEl = $("#searchHistory");
    // having search history to an empty array so we can push entries into it
    var searchHistory = [];

    var cityHistory = localStorage.getItem("history");
    // if city history(from local storage) is not null then show the city names 
    if (cityHistory !== null){
        searchHistory = JSON.parse(cityHistory);
        if (searchHistoryEl.children().length === 0){
            for(var i=0; i<searchHistory.length; i++){
                showHistory(searchHistory[i],searchHistoryEl);
            }
        }
    } else {
        console.log("There is no search history found")
    }


    // if there is search history create then as list items and make them buttons so they are clickable and will run the weather API query
     if (event === undefined){
        var cityName = localStorage.getItem("city");
    } else if ((event.target).nodeName === "LI"){
        fromSearchHistory = true
        var cityName = event.target.textContent;
        console.log(cityName)
    } else if ((event.target).nodeName === "BUTTON") {
        inputField = $("#cityName")
        var cityName = inputField[0].value;
    } 


    // API variables
    var apiKey = "98e46e361787699b6e62a63c5142d5a0"
    var currentDayAPI = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+apiKey;


    return $.ajax({
        url: currentDayAPI,
        method: "GET",
        dataType: "json",
    })

    .then(function (response) {
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var cityName = response.name;
        // Getting todays date
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;

        // push new city entry into searchhistory array and set it in local storage
        if ((!fromSearchHistory)&&(!searchHistory.includes(cityName))){
            showHistory(cityName,searchHistoryEl);
            searchHistory.push(cityName);
            console.log(searchHistory);
            localStorage.setItem("history",JSON.stringify(searchHistory));
        }
        localStorage.setItem("city",cityName);


        // Getting the 5 day forecast weather data
        var forecastAPI = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly&units=imperial&appid="+apiKey;
        $.ajax({
            url: forecastAPI,
            method: "GET"
        })

        .then(function(response) {
            var weatherDataForecast = response.current;
            var description = weatherDataForecast.weather[0].icon;
            var icon = "https://openweathermap.org/img/wn/" + description + ".png";
            var iconImgEl = "<img src="+icon+">"
            // printing city, date, and icon 
            $("#city").html((cityName)+ " ("+today+") "+iconImgEl);
            // setting temp, humidity, wind, uv
            var temp = weatherDataForecast.temp;
            $("#temperature").text(temp+" °F");
            var humidity = weatherDataForecast.humidity;
            $("#humidity").text(humidity+"%");
            var windSpeed = weatherDataForecast.wind_speed;
            $("#windSpeed").text(windSpeed+" mph");
            var uv = weatherDataForecast.uvi;
            // adding a button class to the uv index and making the text white
            $("#uvIndex").addClass("button");
            $("#uvIndex").text(uv);
            $("#uvIndex").css("color","white");

            // if uv is 2 or lower then the color should be green
            // if uv is 8 or lower then the color should be orange
            // whatever else red
            if (uv <= 2){
                $("#uvIndex").css("background-color","green");
                $("#uvIndex").css("padding","8px");
            }
            else if (uv <= 8){
                $("#uvIndex").css("background-color","orange");
                $("#uvIndex").css("padding","8px");
            }
            else{
                $("#uvIndex").css("background-color","red");
                $("#uvIndex").css("padding","8px");
            }

            
            var dailyWeatherArray = response.daily; 
            for (var i = 1;i < 6;i++){
                var currentDay = dailyWeatherArray[i]
                
                var date = new Date();
                date = date.addDays(i);
                
                $(".date"+i).text(date);
                var currentIcon = currentDay.weather[0].icon;
                var icon = "https://openweathermap.org/img/wn/" + currentIcon + ".png";
                $(".icon"+i).attr("src",icon);
                
                var temp = currentDay.temp.day;
                $(".temp"+i).text("Temp: "+temp+" °F");

                var humidity = currentDay.humidity;
                $(".humidity"+i).text("Humidity: "+humidity+"%");
            }
        })
    })
}

// showing the history as list items and appending the search to the list 
function showHistory(name,historyListItems){
    var search = $("<li>");
    search.addClass("list-group-item");
    search.text(name);
    historyListItems.append(search);
}

// function to clear the search history in local story based on clicking the btn
function clearSearchHistory(){
    localStorage.removeItem("history");
    $("#searchHistory").empty();
    getWeatherData();
}
// calling the function that starts the weather query and building of the elements with response
getWeatherData();


// ON CLICKS
$("#submitSearch").on("click",getWeatherData);
$("#searchHistory").on("click",getWeatherData);
$("#clearHistory").on("click",clearSearchHistory);

