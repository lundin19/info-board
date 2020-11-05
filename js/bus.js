//Sætter array med endpoint urls
const endpoints = [
    'http://xmlopen.rejseplanen.dk/bin/rest.exe/departureBoard?id=851400602&rttime&format=json&useBus=1',
    'http://xmlopen.rejseplanen.dk/bin/rest.exe/departureBoard?id=851973402&rttime&format=json&useBus=1'
];
//Sætter array til at samle afgange
const depatures = [];

// Kalder asynkron arrow function - giver os mulighed for at styre respons fra fetch med await
(async () =>{
    // Looper endpoints og fetcher med funktion fetchArray - igen en asynkron løsning
    for(let url of endpoints) {
        // Sætter konstant og venter på respons
        const data = await fetchArray(url);
        // Pusher respons data til array med afgange
        depatures.push(...data.DepartureBoard.Departure);
    }

    // Sortering funktion til at sortere efter array => object.time med (type: string)
    depatures.sort(function(a, b) {
        let x = a.time.toLowerCase();
        let y = b.time.toLowerCase();
        if(x < y) { return -1; }
        if(x > y) { return 1; }
        return 0;
    });    

    // Slicer de første fem keys til array
    const firstfive = depatures.slice(0,5);

    // Henter aktuel timestamp i milisekunder
    const currentTime = new Date().getTime();
    
    buildview(firstfive, currentTime);

})();

async function fetchArray(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err)
    }
}

let buildview = function(firstfive, currentTime){
    
    let busContainer = document.createElement('div');
    busContainer.classList.add('bus-container');

    let containerHeader = document.createElement('div');
    containerHeader.classList.add('container-header');

    let containerHeaderImg = document.createElement('img');
    containerHeaderImg.src = "/img/busser.png";
    let containerHeaderText = document.createElement('h2');
    containerHeaderText.innerHTML = "Bus tider";

    busContainer.appendChild(containerHeader);

    containerHeader.appendChild(containerHeaderImg);
    containerHeader.appendChild(containerHeaderText);

    let containerBody = document.createElement('div');
    containerBody.classList.add('container_body');

    // Looper array
    for(let element of firstfive) {
        // Splitter api dato til et array
        const dateParts = element.date.split('.');
        // Fikser bug med år - sætter 20 foran da det skal være yyyy
        dateParts[2] = 20 + dateParts[2];
        // Splitter api tid til et array
        const timeParts = element.time.split(':');
        // Henter timestamp ud fra api dato format
        const api_time = new Date(dateParts[2], dateParts[1]-1, dateParts[0], timeParts[0], timeParts[1], 0).getTime()/1000;
        // Kontrollerer de to datoer
        //console.log(new Date(currentTime) + "\n" + new Date(api_time*1000));
        // Beregner antal hele minutter
        const minutes = ((api_time - (currentTime/1000))/60).toFixed(0);

        let containerBodyLine = document.createElement('h3');
        containerBodyLine.innerText = element.line;

        let containerBodydirection = document.createElement('h3');
        containerBodydirection.innerText = element.direction;

        let containerBodytime = document.createElement('h3');
        containerBodytime.innerText = `${minutes} Min`;

        const containerContent = document.createElement('div');
        containerContent.classList.add('container-content')

        containerContent.appendChild(containerBodyLine);
        containerContent.appendChild(containerBodydirection);
        containerContent.appendChild(containerBodytime);

        containerBody.appendChild(containerContent);


        busContainer.appendChild(containerBody);
        let post = document.getElementById('post');
        post.appendChild(busContainer);
    }
}