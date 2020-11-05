
// PROXY => CORS Anywhere helps with accessing data from other websites that is normally forbidden by the same origin policy of web browsers. This is done by proxying requests to these sites via a server (written in Node.js, in this case).
const proxy = 'https://cors-anywhere.herokuapp.com/';

// API's
// 1§ vejr eu api
let vejrEu = `${proxy}https://vejr.eu/api.php?location=Aalborg&degree=C%27))`; //henter API ned
// §2 DarkSky api
let darkSky = `${proxy}https://api.darksky.net/forecast/2f35c97a3f5b8edad9aecb3fa76058cb/57.0488,9.9217`;
console.log("fetching data");


/// 1§ VEJR EU API
// GET => temperature & skyText
fetch(vejrEu) 
.then((response) => {
    return response.json(); 
})
.then((data) => {
    // Send to View section
    buildView(data)
})
.catch(
);


/// 2§ DARK SKY API
// GET => Icon
fetch(darkSky) 
.then((response) => {
    return response.json(); 
})
.then((data) => {
    // Send to View section
    buildIcon(data) 
})
.catch(
);



/// View ///

function buildView(data) {
    // Declare data 
    const {temperature, skyText} = data.CurrentData;
    // Create current date
    let today = new Date();
    let hr = today.getHours();
    let min = today.getMinutes();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    // Date Structure
    today = `${dd}-${mm}-${yyyy}`;
    // Set value
    document.querySelector('.time').innerHTML = today;
    document.querySelector('.date').innerHTML = `${hr}:${min}`;
    document.querySelector('.temp').innerHTML = temperature + '&#176';
    document.querySelector('.summary').innerHTML = skyText;
    
    
    
    
}
/// Icon
function buildIcon(data) {
    const {icon} = data.currently;                  
    // Call getIcon
    document.querySelector('.icon').src = 'img/svg/' + getIcon(icon) 
}
// Check current date and return appropriate src string
function getIcon(icon) {
   
    switch (icon) {
        // If status === case => then return matching weather icon 
        case 'clear-day': return "wi-day-sunny.svg";
        case 'clear-night': return "wi-night-clear.svg";
        case 'partly-cloudy-day': return "wi-day-cloudy.svg";
        case 'partly-cloudy-night': return "wi-night-alt-cloudy.svg";
        case 'cloudy': return "wi-cloudy.svg";
        case 'lightrain': return "wi-night-rain-mix.svg";
        case 'occasionalshowers': return "wi-night-rain-mix.svg";
        case 'rain': return "wi-rain.svg";
        case 'sleet': return "wi-sleet.svg.svg";
        case 'snow': return "wi-snow.svg";
        case 'wind': return "wi-windy.svg";
        case 'fog': return "wi-fog.svg";

        default: return "";       
    }

    
    /* DarkSky weather types:

        clear-day
        clear-night
        partly-cloudy-day
        partly-cloudy-night
        cloudy
        rain
        sleet
        snow
        wind
        fog
    
    */
}
