const newsSlider = document.querySelector('.ticker-wrap')

const fetchNews = (async function () {
    const url = 'https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=PgarRRswJ13m0Wn8kjUyvC7cBp2SfSyh';
    const response = await fetch(url);
    const data = await response.json();
    await loopData(data.results)
}());

let oldArray = Array();
function loopData(data) {

    for (const newsTitle of data) {
        oldArray.push(newsTitle.title)
    }

    createSlider(oldArray);
}

function createSlider(value) {
    let div = document.createElement('div');
    div.setAttribute('class', 'ticker');
    for (const news of value) {
        div.innerHTML += `<div class="ticker__item">${news}</li>`
    }
    newsSlider.appendChild(div);
}