'use strict';

module.exports = {
    get: function (store, key) {
        const data = JSON.parse(localStorage.getItem(key));

        if (data) {
            Object.assign(store, data);
        }
        return Promise.resolve(store)
    },

    set: function (store, key) {
        localStorage.setItem(key, JSON.stringify(store));
    }
};