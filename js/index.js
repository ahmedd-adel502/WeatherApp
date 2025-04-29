"use strict"
//*HTML elements
let locationInput = document.querySelector("#locationInput")
let htmlContainer = document.querySelector("#htmlContainer")
let mailBtn = document.querySelector("#mailBtn")
let mailInput=document.querySelector("#mailInput")
//^ Variables

//& Functions
navigator.geolocation.getCurrentPosition(
    function (position) {
        getCurrentWeather(`${position.coords.latitude},${position.coords.longitude}`);
    },
    function () {
        getCurrentWeather("cairo");
    }
);
async function getCurrentWeather(loctaion = "cairo"){
   let response = await fetch(`http://api.weatherapi.com/v1/current.json?key=a12872faa0734ee89cd160544252904&q=${loctaion}`)
   let currentWeather = await response.json()
   let forecastResponse= await fetch(`http://api.weatherapi.com/v1/forecast.json?key=a12872faa0734ee89cd160544252904&q=${loctaion}&days=3`)
   let forecast = await forecastResponse.json()
   
   let currentDay= new Date()
     let nextDay = new Date(currentDay)
    nextDay.setDate(currentDay.getDate()+1)
    let theDayAfter= new Date(currentDay)
    theDayAfter.setDate(currentDay.getDate()+2)
    
   
   htmlContainer.innerHTML=`
                            <div class="col-md-4 col-sm-12">
                                <div class="inner text-center">
                                    <div class="top-part d-flex justify-content-between px-3 py-4">
                                        <span id="currentDay">${currentDay.toLocaleDateString("en-US",{ weekday:"long"})}</span>
                                        <span>${currentDay.getDate()} ${currentDay.toLocaleDateString("en-US",{month:"long"})}</span>
                                    </div>
                                    <div class="main-part px-4 py-4">
                                        <h3 id="currentCity">${currentWeather.location.name}</h3>
                                        <span class="d-block" id="currentTemp">${currentWeather.current.temp_c}<sup>o</sup>c</span>
                                        <img id="currentTempImg" src="https:${currentWeather.current.condition.icon}" alt="${currentWeather.current.condition.text}">
                                        <ul class="list-unstyled d-flex justify-content-around" id="currentDayInfo">
                                            <li><i class="fa fa-umbrella"></i> 20%</li>
                                            <li><i class="fa fa-wind"></i> 18Km/h</li>
                                            <li><i class="fa fa-compass"></i> East</li>
                                        </ul>
                                    </div>
                                </div>
                             </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="center">
                                    <div class="center-top-part d-flex justify-content-center px-3 py-4">
                                        <span>${nextDay.toLocaleDateString("en-US",{weekday:"long"})}</span>
                                    </div>
                                    <div class="center-main-part px-4 py-4 text-center">
                                        <img id="nextDayImg" src="https:${forecast.forecast.forecastday[1].day.condition.icon}" alt="sunny">
                                        <span class="d-block" id="nextDayGreatTemp">${forecast.forecast.forecastday[1].day.maxtemp_c}<sup>o</sup>c</span>
                                        <span class="d-block" id="nextDaySmallTemp">${forecast.forecast.forecastday[1].day.mintemp_c}<sup>o</sup></span>
                                        <span class="text-primary-emphasis text-capitalize" id="tempDesc">${forecast.forecast.forecastday[1].day.condition.text}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="last">
                                    <div class="last-top-part d-flex justify-content-center px-3 py-4">
                                        <span>${theDayAfter.toLocaleDateString("en-US",{weekday:"long"})}</span>
                                    </div>
                                    <div class="last-main-part px-4 py-4 text-center">
                                        <img id="dayAfterNextImg" src="https:${forecast.forecast.forecastday[2].day.condition.icon}" alt="sunny">
                                        <span class="d-block" id="dayAfterNextTemp">${forecast.forecast.forecastday[2].day.maxtemp_c}<sup>o</sup>c</span>
                                        <span class="d-block" id="dayAfterNextSmallTemp">${forecast.forecast.forecastday[2].day.mintemp_c}<sup>o</sup></span>
                                        <span class="text-primary-emphasis text-capitalize" id="dayAfterNextTempDesc">${forecast.forecast.forecastday[2].day.condition.text}</span>
                                    </div>
                                </div>
                            </div>
                            `
}

//! searchRegex
let searchRegex=/^[A-Za-z]{3,}\s*([A-Za-z]{3,})?$/
async function searchCities(){
    let searchValue=locationInput.value.toLowerCase()
    if(searchRegex.test(searchValue)){
        let result = await fetch (`http://api.weatherapi.com/v1/search.json?key=a12872faa0734ee89cd160544252904&q=${searchValue}`)
        let resultData= await result.json()
        getCurrentWeather(resultData[0].name);
    }
       
}
//! Events
locationInput.addEventListener("input",function(){
    searchCities()
})
mailBtn.addEventListener("click",function(){
    let email = mailInput.value
    let emailRegex=/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/
    if(emailRegex.test(email)){
        window.location.href=`mailto:ahmeddadel502@gmail.com?subject= Weather Report`
    } else {
        Swal.fire({
            icon: "error",
            title: "Invalid Email",
            text: "Please enter a valid email address!",
        });
    }
})
