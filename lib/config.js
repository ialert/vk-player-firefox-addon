"use strict";

//Include SDK Config Helper
const ConfigHelper = require("sdk/simple-storage");


exports.get = function(key) {

    return ConfigHelper.storage[key]
}

exports.set = function(key, value) {

    ConfigHelper.storage[key] = value;
}

exports.delete = function(key) {

    delete ConfigHelper.storage[key];
}