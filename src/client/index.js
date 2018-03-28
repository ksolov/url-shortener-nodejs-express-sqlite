import { API } from './api';
(function () {
    "use strict";

    const form = document.getElementById('form-shorten');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const value = form.url.value;
        const errorNode = document.getElementById("error");
        const linkNode = document.getElementById("link");
        linkNode.innerHTML = '';
        errorNode.innerHTML = '';
        if (value.match(/^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)/)) {
            const url = value.match(/^(https?:\/\/)/) ? value : 'http://' + value;
            API.longToShort(url).then((res) => {
                linkNode.innerHTML = res.shortUrl;
            });
        } else {
            errorNode.innerHTML = 'URL не валидный!'
        }
    })
}());
