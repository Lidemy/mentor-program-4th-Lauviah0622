import jquery from 'jquery';
import { addPost, getPost, getPagePosts } from './api';
import { addCard, _ } from './utils';
import { formTemplate } from './template';
let page = 0;



export function init(options) {

    let siteKey = options.siteKey;
    let apiUrl = options.apiUrl;
    let containerElement = jquery(options.container);

    containerElement.append(formTemplate);


// 懶得改 code 就用超髒的方式XD，不過是因為沒有用到 CSS，不然常見的 classname 可能會網站本身的 CSS 蓋過去
// 用這個方式有遇到一個問題是 $ 裡面有用到 init 的參數，就沒辦法把 $ 丟到其他 module，需要操作 dom 的部分都要在 index.js 裡面處理
    function $(selector) {
        let s = `${options.container} ${selector}`;
        return jquery(s)
    }
    
    renderPagePosts()
    // first render 

    containerElement.attr('data-siteKey', siteKey)

    $('.submit').click(() => {
        const content = $('.content').val();
        const nickname = $('.nickname').val();
        $('.content').val("");
        $('.nickname').val("");

        addPost(apiUrl, siteKey, nickname, content, (data) => {
            getPost(apiUrl, siteKey, data.content.insertId, (data) => {
                addCard($('.posts'), data.content.posts, false);
            });
            //只顯示最新的留言
        });
    })


    $('.more').click(() => {
        page += 1;
        renderPagePosts()
    });

    function renderPagePosts() {
        getPagePosts(apiUrl, siteKey, page, (data) => {
            for (let post of data.content.posts) {
                addCard($('.posts'), post, true);
            }

            if (data.content.rest > 0) {
                $('.more').show();
            } else {
                $('.more').hide();
            }
            $('.loading').hide();
        })
    }

}




