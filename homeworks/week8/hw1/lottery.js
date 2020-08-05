function buttonHandler(e) {
    sendXHR(getPrize)
}

function sendXHR(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://dvwhnbka7d.execute-api.us-east-1.amazonaws.com/default/lottery', true);
    xhr.onload = () => {
        const loading = document.querySelector('.loading');
        loading.classList.add('onload')
        if (xhr.status >= 200 && xhr.status < 400) {
            try {
                var data = JSON.parse(xhr.response);
            } catch (error) {
                console.log('JSON parse Error');
            }
            setTimeout(() => {
                callback(data.prize)
            }, 700)
        } else {
            console.log('request error')
            callback('error')
        }
    };

    xhr.onerror = () => { console.log('local error') };
    xhr.send()
}

function getPrize(prize) {
    console.log(prize);
    let modal = document.querySelector('.prize__modal');

    const wrapper = document.querySelector('.wrapper');
    const setBackground = (url) => {
        wrapper.style.background = url;
    }
    const setModal = (content, color = "#000") => {
        const prizeTitle = document.querySelector('.prize__modal h3');
        prizeTitle.innerText = content;
        prizeTitle.style.color = color;

    }

    const reset = () => {
        setBackground('url("./images/lottery/games-bn@3x.jpg");');
        wrapper.classList.add('lottery');
        wrapper.classList.remove('prize');

    }

    document.querySelector('.loading').classList.remove('onload');
    if (prize === 'error') {
        alert('系統不穩定，請再試一次');
        reset()
        return
    }


    wrapper.classList.remove('lottery');
    wrapper.classList.add('prize');
    modal.classList.remove('animating');
    void modal.offsetWidth
    modal.classList.add('animating');



    if (prize === 'FIRST') {
        setBackground('url("./images/lottery/bg@2x.jpg")');
        setModal('恭喜你中頭獎了！日本東京來回雙人遊！');
    }
    if (prize === 'SECOND') {
        setBackground('url("./images/lottery/living-room-1872192_1920.jpg")');
        setModal('二獎！90 吋電視一台！');
    }
    if (prize === 'THIRD') {
        setBackground('url("./images/lottery/youtube-2617510_1920.jpg")');
        setModal('恭喜你抽中三獎：知名 YouTuber 簽名握手會入場券一張，bang！')
    }
    if (prize === 'NONE') {
        setBackground('#333');
        setModal('銘謝惠顧', '#fff');

    }
}

document.querySelectorAll('.lottery-btn')[0].addEventListener('click', buttonHandler);
document.querySelectorAll('.lottery-btn')[1].addEventListener('click', buttonHandler);

