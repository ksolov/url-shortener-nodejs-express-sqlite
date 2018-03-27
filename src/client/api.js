import config from './config';

export const API = {};

const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=UTF-8'
};

function callApi(endpoint, body, headers, method = 'POST') {
    const body_ = body ? JSON.stringify(body) : null;
    return Promise.race([
        fetch(config.SERVER_ADDRESS + config.SERVER_API + endpoint, {
            method: method,
            headers: headers || defaultHeaders,
            body: body_
        }),
        new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error('request timeout')), 30000);
        })
    ])
        .then(response => response.json().then(json => ({ json, response })))
        .then(({ json, response }) => {
            if (!response.ok) {
                return Promise.reject({ json, response });
            }
            return json;
        });
}

API.longToShort = function(url) {
    return callApi('longToShort', { url })
};

API.create = function() {
    return callApi('create')
};
