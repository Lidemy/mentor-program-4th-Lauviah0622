let topGames;
let currentGame = '';
const page = (function () {
    let currentPage = 1;
    let total;
    const indicator = document.querySelector('#page');
    const prevPage = document.querySelector('#prevBtn');
    return {
        nextPage() {
            currentPage++;
            return currentPage;
        },
        prevPage() {
            if (currentPage > 1) {
                currentPage--;
            }
            return currentPage;
        },
        get current() {
            return currentPage
        },
        syncIndicator() {
            console.log(indicator)
            indicator.innerText = currentPage;
            if (currentPage === 1) {
                prevPage.classList.add('disabled')
            } else {
                prevPage.classList.remove('disabled')
            }
            return
        },
        resetPage() {
            currentPage = 1;
            return currentPage
        }
    }
})();
const streamTemplate = document.querySelector('figure.stream').outerHTML;

function getGames() {
    sendXHR('games/top?limit=5', (data) => {
        const gameNames = data.top.map(item => item.game.name);
        topGames = gameNames;
        currentGame = topGames[0];

        let listEle = document.querySelector('ul.nav');
        let listInnerHTML = topGames.map(game => {
            const template = listEle.innerHTML.trim();
            return template.replace(/{{.*}}/, game)
        }).join('');
        listEle.innerHTML = listInnerHTML;


        getStreams(currentGame, page.current)

        const listItems = document.querySelectorAll('li.nav__item');
        for (let i = 0; i < listItems.length; i++) {
            const listItem = listItems[i];
            listItem.addEventListener('click', function () {
                getStreams(this.innerText, page.resetPage());
            })

        }
    })
}

function getStreams(gameName, currentPage) {
    // let offset = (page - 1) * 20;
    let offset = (currentPage - 1) * 20;
    console.log(offset)
    sendXHR(`streams/?game=${gameName}&limit=20&offset=${offset}`, (data) => {
        let galleryInnerHtML = data.streams.map(stream => {
            return streamTemplate
                .replace('{{channel-link}}', stream.channel.url)
                .replace('{{channel-title}}', stream.channel.status)
                .replace('{{channel-name}}', stream.channel.display_name)
                .replace('{{channel-avatar}}', stream.channel.logo)
                .replace('{{channel-preview}}', stream.preview.large);
        }).join('');
        document.querySelector('.streams__gallery').innerHTML = galleryInnerHtML;

        document.querySelector('h1.streams__title').innerText = gameName;
        // console.log(page)
        page.syncIndicator();
    })
}

function sendXHR(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.twitch.tv/kraken/${url}`, true);
    xhr.setRequestHeader('Client-ID', 'qi079afnud4wnc8d9c5ii2x863sq7l');
    xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
    xhr.onload = function () {
        if (xhr.status >= 400 || xhr.status < 200) {
            console.log('res Err');
        }
        try {
            let rawData = JSON.parse(xhr.response);
            callback(rawData)
        } catch (error) {
            console.log(error)
        }
    }

    xhr.onerror = function () {
        console.log('** An error occurred during the transaction')
    }

    xhr.send()
}


(function () {
    window.onload = getGames();
    document.querySelector('#nextBtn').addEventListener('click', () => {
        getStreams(currentGame, page.nextPage())
    })
    document.querySelector('#prevBtn').addEventListener('click', () => {
        console.log('123')
        getStreams(currentGame, page.prevPage())
    })

    document.querySelector('.menu').addEventListener('click', function(e) {
        document.querySelector('.nav').classList.toggle('closed')
    })
})()