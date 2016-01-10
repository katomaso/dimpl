'use strict';

module.exports = {
    get: function (store) {
        return new Promise(function (resolve) {
            chrome.storage.sync.get(store, function (data) {
                Object.assign(store, data);
                resolve(store);
            }.bind(this));
        });
    },

    set: function (store) {
        chrome.storage.sync.set(store);
    }
};