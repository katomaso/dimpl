'use strict';

const constants = require('../constants');
const dispatcher = require('../dispatcher');
const EventEmitter = require('events').EventEmitter;
const fileSystem = require('../file-system/index');

const STORAGE_KEY = 'navigation';

const store = {
    baseId: '',
    baseUrl: '',
    currentUrl: '',
    isLocal: false,
    regexes: [
        "^.*/(.*)\.[^/]+$"
    ]
};

const ephemeralStore = {
    baseEntry: null,
    basePath: ''
};

let _provider;

const NavigationStore = Object.assign({}, EventEmitter.prototype, {
    init: function (provider) {
        _provider = provider;

        const promise = provider.get(store, STORAGE_KEY).then(fileSystem.getBaseEntry);

        return promise.then(function (result) {
            ephemeralStore.baseEntry = result[0];
            ephemeralStore.basePath = result[1];
        });
    },

    emitChange: function () {
        _provider.set(store, STORAGE_KEY);
        this.emit(constants.events.CHANGE);
    },

    getBaseEntry: function () {
        return ephemeralStore.baseEntry;
    },

    getBasePath: function () {
        return ephemeralStore.basePath;
    },

    getBaseUrl: function () {
        return store.baseUrl;
    },

    getCurrentUrl: function () {
        return store.currentUrl;
    },

    getRegexes: function () {
        return store.regexes;
    },

    isLocal: function () {
        return store.isLocal;
    },

    addChangeListener: function (callback) {
        this.on(constants.events.CHANGE, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(constants.events.CHANGE, callback);
    }
});

NavigationStore.dispatchToken = dispatcher.register(function (action) {
    switch (action.type) {
        case constants.actions.CHANGE_BASE_ENTRY:
            fileSystem.getEntryPath(action.text).then(function (path) {
                store.currentUrl = '';
                store.baseId = fileSystem.getEntryId(action.text);
                ephemeralStore.baseEntry = action.text;
                ephemeralStore.basePath = path;
                NavigationStore.emitChange();
            });
            break;

        case constants.actions.CHANGE_BASE_URL:
            if (store.baseUrl != action.text) {
                store.currentUrl = action.text;
            }
            store.baseUrl = action.text;
            NavigationStore.emitChange();
            break;

        case constants.actions.CHANGE_IS_LOCAL:
            store.isLocal = action.text;
            store.currentUrl = store.isLocal ? '' : store.baseUrl;
            NavigationStore.emitChange();
            break;

        case constants.actions.CHANGE_CURRENT_URL:
            store.currentUrl = action.text;
            NavigationStore.emitChange();
            break;

        case constants.actions.RESET_REGEXES:
            store.regexes = action.list;
            NavigationStore.emitChange();
            break;
    }
});

module.exports = NavigationStore;