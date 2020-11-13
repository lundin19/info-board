async function fetchData() {
    //her henter vi data fra api'et
    let response = await fetch('https://api.mediehuset.net/infoboard/activities');
    //tjekker vi om det er af json format
    let data = await response.json();

    //hvis det er det, så kan vi tilgå data'en i andre funktioner
    return data.result;
};

//dette bruges til at ændre vores nuværende klokkeslet
const addHours = 0;
const addSeconds = 3600 * addHours;

//dette er vores nuværende klokkeslet (timestamp)
let currentTime = new Date() / 1000 + addSeconds;

//dette er klokkeslettet for starten af dagen (klokken 00:00:00)
let dayStart = new Date().setHours(0, 0, 0, 0) / 1000;

//her laver vi et array med de forskellige klokkeslet som skemaet har
const classTimes = [
    {start: dayStart + 29700, end: dayStart + 33599}, // Kl. 8.15 - 9.20
    {start: dayStart + 33600, end: dayStart + 37199}, // Kl. 9.20 - 10.20
    {start: dayStart + 37200, end: dayStart + 41399}, // Kl. 10.20 - 11.30
    {start: dayStart + 41400, end: dayStart + 46799}, // Kl. 11.30 (12.00) - 13.00
    {start: dayStart + 46800, end: dayStart + 50399}, // Kl. 13.00 - 14.00
    {start: dayStart + 50400, end: dayStart + 54900}, // Kl. 14.00 - 15.15
];

//dette er vores controller som håndterer det data som kommer fra api'en
async function loadData() {

    //her sætter vi data'ene fra fetchData i et array
    let activityArr = [...await fetchData()];

    let amountOfActivities = 17;

    //her finder vi ud af hvilket interval vi er i (hvor vi er i arrayet classTimes)
    const currentTimeOfDay = classTimes.filter(obj => obj.start <= currentTime && obj.end >= currentTime);

    //her deklererer vi en variabel som kommer til at være et array. dette array kommer fra det filtreret activityArr.
    let listOfActivities;

    //her kigger vi på om vi befinder os i arrayet classTimes og hvis vi gør så skal den filtrerer activityArr efter hvilke timer som er igang 
    if (currentTimeOfDay.length) {
        listOfActivities = activityArr.filter(activity =>
            activity.timestamp >= currentTimeOfDay[0].start);
                listOfActivities = listOfActivities.filter((activity, idx) => idx < amountOfActivities - 1);

                if(!listOfActivities.length) {
                    getFirstActivities()
                };

             //hvis vi ikke er i arrayet så skal den finde timerne fra næste dag
    } else {
        getFirstActivities()
    };

    //dette er funktionen som finder timerne for den næste dag
    function getFirstActivities() {
        let firstKey = activityArr[0];
        listOfActivities = activityArr.filter(activity => activity.timestamp <= (firstKey.timestamp + 3899));

        return listOfActivities;
    }

    //her deklererer vi en konstant som er et array af de timer som er aktive
    const activeActivities = [];

    //hvis vi er inde for et interval i classTimes så tager vi de filtreret aktiviteter og indsætter(mapper) dem i arrayet activeActivities.
    listOfActivities.map(activity => {
        const listItem = [activity.timestamp, activity.classroom, activity.class, activity.name, activity.friendly_name];

        activeActivities.push(listItem);        
    });

    //her returner vi konstanten activeActivities, så vi kan bruge den i en senere funktion 
    return activeActivities;
};

//her laver vi vores view funktion
async function buildActivitiesView() {

    //her indsætter vi data'ene fra loadData funktionen i et array
    let activeActivities = [...await loadData()];
    
    //her deklererer vi en variabel som er vores activityWidget
    let activityWidget = document.querySelector("#activity-widget");

    //da der altid skal ligge en liste i toppen af widgeten, så indsætter vi den her.
    activityWidget.innerHTML = 
        `<li class="card">
            <p class="time">Tid</p> 
            <p class="location">Klasse</p> 
            <p class="class">Hold</p> 
            <p class="topic">Fag</p>
        </li>`;

    //da aktiviteterne ændrer sig iforhold til tiderne på dagen, så laves de her.
    for (item of activeActivities) {

        //her deklererer vi et par variabler
        let date = new Date(item[0] * 1000);
        let time = `${date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`;
        let classs = `${item[2]}`;

        //dette gør at hvis der ikke findet et friendly_name så bruger den bare det normale name
        let topic = item[4];
            if (item[4] == '') {
                topic = item[3];
            }

        let classShorthands = ['we', 'ggr', 'agr', 'abi', 'gr', 'dm', 'mg', 'iw']; //array med forkortelser af navne for klasserne

        for (let i = 0; i < classShorthands.length; i++) {
            if(classs.search(classShorthands[i]) >= 0) {
                activityWidget.innerHTML += 
                `<li class="card">
                    <p class="time ${classShorthands[i]}">${time}</p> 
                    <p class="location">${item[1]}</p> 
                    <p class="class">${classs}</p> 
                    <p class="topic">${topic}</p>
                </li>`;
                break;
            };
        };
    };
};

buildActivitiesView();
setInterval(() => {buildActivitiesView()}, 60000);