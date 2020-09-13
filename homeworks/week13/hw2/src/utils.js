import {createCardHtml} from './template'


function showErrorMsg (text) {
    return (err) => {
        throw new Error(err)
    };
}

function addCard(target, post, append) {
    const cardHtml = createCardHtml(
        escape(post.nickname),
        escape(post.content),
        post.created_at
    )
    if (append) {
        target.append(cardHtml);
    } else {
        target.prepend(cardHtml);
    }
}

function escape(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export {showErrorMsg ,addCard}