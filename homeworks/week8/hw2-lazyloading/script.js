let topGames;
let currentGame = '';
const UNIT = 9;
const index = (function () {
    let current = 0;
    return {
        nextIndex() {
            current += (UNIT + 1);
            return current;
        },
        get current() {
            return current
        },
        reset() {
            current = 0;
            return current
        }
    }
})();
const streamTemplate = document.querySelector('figure.stream').innerHTML;

function getGames() {
    sendXHR('games/top?limit=5', (data) => {
        const gameNames = data.top.map(item => item.game.name);
        topGames = gameNames;
        if (!currentGame) currentGame = topGames[0];

        let listEle = document.querySelector('ul.nav');
        let listInnerHTML = topGames.map(game => {
            const template = listEle.innerHTML.trim();
            return template.replace(/{{.*}}/, game)
        }).join('');
        listEle.innerHTML = listInnerHTML;

        getStreams(currentGame, index.current)

        const listItems = document.querySelectorAll('li.nav__item');
        for (let i = 0; i < listItems.length; i++) {
            const listItem = listItems[i];
            listItem.addEventListener('click', function () {
                currentGame = this.innerText
                getStreams(currentGame, index.reset());
                scrollTo({
                    top: 100,
                    left: 100,
                    behavior: 'smooth'
                })

            })

        }
    })
}

function getStreams(gameName, nextIndex) {
    console.log(nextIndex)
    sendXHR(`streams/?game=${gameName}&limit=${UNIT}&offset=${nextIndex}`, (data) => {
        const gallery = document.querySelector('.streams__gallery');
        if (nextIndex === 0) gallery.innerHTML = '';
        data.streams.forEach(stream => {
            const streamElement = document.createElement('figure');
            streamElement.classList.add('stream');

            const streamInnerHTML = streamTemplate
                .replace(/{{channel-link}}/g, stream.channel.url)
                .replace('{{channel-title}}', stream.channel.status)
                .replace('{{channel-name}}', stream.channel.display_name)
                .replace(/{{channel-avatar}}/g, stream.channel.logo)
                .replace(/{{channel-preview}}/g, stream.preview.large);

            streamElement.innerHTML = streamInnerHTML;
            observer.observe(streamElement);
            gallery.appendChild(streamElement);

        });

        document.querySelector('h1.streams__title').innerText = gameName;

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

    let timeout = true;
    window.addEventListener('scroll', (e) => {
        if (!timeout) return;
        timeout = false;
        console.log('triggggger')
        const maxScroll = document.querySelector('body').offsetHeight - window.innerHeight;
        // totalHeight - screenHeight
        const restScroll = maxScroll - window.scrollY;
        setTimeout(() => timeout = true, 250);
        if (restScroll > 500) return;
        getStreams(currentGame, index.nextIndex())
    }
    )
})()



const observer = new IntersectionObserver(function (observes) {
    observes.forEach(observe => {
        if (!observe.isIntersecting) return;
        // console.log(observe.target);
        // console.log(observe.isIntersecting)

        const preview = observe.target.children[0].children[0].children[0];
        const avatar = observe.target.children[1].children[0].children[0]
        implementImg(preview);
        implementImg(avatar);
        observer.unobserve(observe.target)


    })

}, {
    rootMargin: '0px 0px 200px 0px',
    threshold: 0
})



function implementImg(imgEle) {
    const imgSrc = imgEle.getAttribute('data-src');
    imgEle.src = imgSrc;
}


// 1. 把 page 的功能取消掉
// 2. 把 lazy loading event scroll
// 2.5 加上 throttle
// 3. 把 lazy loading 圖片的功能加上去 => InterSectionObserver
// 加上 placeholder


