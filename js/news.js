// newsContet: Used for fetching JSON from our URI, and sends sorted data.result (array) to sortContent.
// sortContent: Is used for sorting out the HTML tags/elements from the strings content in data. Sends sorted string and result data to our createNewsCard.
// createNewsCard: Creates DOM from data.

const newsContainer = document.getElementById('news-container');

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Fetch content from URI ━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
const newsContent = (async function () {
    const url = 'https://api.mediehuset.net/infoboard/news';
    const response = await fetch(url);
    const data = await response.json();
    sortContent(data.result)
}())

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Sort content fetched from URI ━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
function sortContent(data) {
    for (let result of data) {
        let str = result.content
        let regEx = new RegExp(/<.+?>/, 'gi');
        let shortenString = str.replace(regEx, '').substring(0, 250);


        if (shortenString.length >= 250) {
            shortenString = shortenString + '...';
            
        }
        
        shortenString = shortenString + '...';
        let qrCode = createQrCode(shortenString)


        let date = result.datetime.slice(0, 10)
        checkForLength(result.title, date, shortenString, qrCode)
    }
}

function createQrCode(value) {
    let qrCode = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + value;
    return qrCode;
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━ createNewsCard is our VIEW, which uses data from sortContent ━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
function checkForLength(title, date, string, qrCode) {
    let newsCard = document.createElement('div');
    newsCard.setAttribute('class', 'newsCard')


    newsCard.innerHTML += `
        <p class="news-date">${date}</p>
        <section class="news-head">
        <h3 class="news-header">${title}</h3>
        <img class="qr-kode" src="${qrCode}" alt="">
        </section>
        <p class="news-content">${string}</p>`

    if (string.length > 250) {
        newsCard.insertAdjacentHTML('beforeend', `        
        <p class="qr-text">LÆS MERE SKAN QR KODEN</p>
        `)
    }
    newsContainer.appendChild(newsCard);
}