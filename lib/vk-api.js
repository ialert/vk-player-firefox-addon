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


    }


};


//export VK api class
exports.vk = VKApi;