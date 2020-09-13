import $ from 'jquery';
import { showErrorMsg } from './utils';

function addPost(apiUrl, siteKey, nickname, content, success_cb) {
    const data = {
        content,
        site_key: siteKey,
        nickname
    }
    // 原本要用 async，可是跑出 regeneratorRuntime is not defined，應該是 babel 的問題？
    var body = new FormData();

    for ( var key in data ) {
        body.append(key, data[key]);
    }

    fetch(apiUrl, {
        method: "POST",
        body
    }).then((res) => {
        return res.json()
    }).then(json => {
        success_cb(json)
        console.log(json);
    })
}

function getPost(apiUrl, siteKey, id, success_cb) {
    const url = `${apiUrl}?site_key=${siteKey}&id=${id}`;

    
    $.ajax({
        method: "GET",
        url,
        success: success_cb,
        error: showErrorMsg('getPost')
    })
}

function getPagePosts(apiUrl, siteKey, page, success_cb) {
    
    const url = `${apiUrl}?site_key=${siteKey}&limit=5&offset=${page * 5}`;
    $('#loading').show();

    $.ajax({
        method: "GET",
        url,
        success: success_cb,
        error: showErrorMsg('getPagePosts')
    });
}


export { addPost, getPost, getPagePosts }