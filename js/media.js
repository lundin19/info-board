//=============================================   Beskrivelse af funktion   ========================================//
//newsContent(apiUrl); - apiUrl = Url'en til apiet
//Fetcher fra vores api og sørger for at vi får det tilbage i json og sender dataen videre

//sortingMedia(data); - data = Dataen fra apiet
//looper igennem dataen fra apiet som vi får fra newsContent og deler det ud, derfra sender vi det videre


//creatingMedia(title, file, ref); - title = Er der bare | file = fil lokation | ref = youtube video id
//Kigger om det er et billede eller en video vi har fået fra apiet, og sender link til lokationen videre

//insertVideo(link); - link = youtube linket
//Skaber en iframe og sætter src til linket vi får fra creatingMedia og appender det til vores DOM

//=============================================   Globale varibler   ========================================//
const API = 'https://api.mediehuset.net'
const ENDPOINT_NEWS = '/infoboard/news';
const ENDPOINT_MEDIA = '/infobard/media';

let getData = mediaContent('https://api.mediehuset.net/infoboard/media');

// Youtube API
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//=============================================   Fetch af data   ========================================//
function mediaContent(apiUrl) {
    fetch(apiUrl)
        .then((res) => { return res.json(); })
        .then((data) => { sortingMedia(data.result); })
}

//=============================================   Sorting af data   ========================================//
let sortArr = Array();
function sortingMedia(data) {
    for (let media of data) {
        let ref = media.reference;
        sortArr.push(ref)
    }
}


//=============================================   Vis Video  ========================================//
let player;
function onYouTubeIframeAPIReady(slides) {

    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: sortArr[1],
        playerVars: {
            autoplay: 1,
            mute: 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

//=============================================   Sorting af data type   ========================================//
//Ting vi skal gøre
//Autoplay og mute, Karussel for Media tingetang, Køre nyt iteration efter videon er færdig 
function creatingMedia(title, file) {
    if(file) {
        //Få faking henz til at give link til billede
        console.log("IM A TOTALLY TRUE IMAGE");
    } else {
        console.log("Someone decided not to give a path at ALL!");
    }
}

function onPlayerReady(event) {
    event.target.playVideo();
}


let slide = 1;
function onPlayerStateChange(event) {
    if (event.data == 0) {
        slide == sortArr.length ? slide = 1 : slide++
        player.loadVideoById(sortArr[slide])
    }
}