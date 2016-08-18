"use strict";

//Vk.com API OAuth URL
const AUTH_URL = 'https://oauth.vk.com/authorize';

//Vk.com API calling methods URL
const METHOD_URL = 'https://api.vk.com/method/';

const ACCESS_TOKEN_URL = 'https://oauth.vk.com/blank.html';

//Default Vk.com API version,now 5.57
const DEFAULT_API_VERSION = '5.57';

//Successful HTTP status
const HTTP_STATUS_OK = "200";

//require Request module from Firefox SDK
const Request = require("sdk/request").Request;


class VKApi {

    constructor(options) {

        this.options = Object.assign({}, {
            display: 'page',
            version: DEFAULT_API_VERSION,
        }, options);
    }

    /**
     * set accessToken var
     * @param  {String} token vk.com api access token
     */
    set accessToken(token) {

        this._accessToken = token;
    }

    /**
     * get accessToken var
     * @return {String} vk.com api access token
     */
    get accessToken() {

        return this._accessToken;
    }

    /**
     * Get default vk.com API oauth url
     * @param  {String} scope permissions for app 
     * @return {String}       Oauth url
     */
    getAuthUrl(scope = '') {

        let params = {

            client_id: this.options.client_id,
            display: this.options.display,
            scope: scope,
            response_type: 'token',
        }

        return [AUTH_URL, '?', this.buildQueryString(params)].join('');
    }

    /**
     * Get access token url from module const
     * @return {Strng} Access Token Url
     */
    getAccessTokenUrl() {

        return ACCESS_TOKEN_URL;
    }


};


//export VK api class
exports.vk = VKApi;