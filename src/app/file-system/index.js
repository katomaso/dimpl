'use strict';

const utils = require('../utils');
const superagent = require('superagent');

let _provider;

module.exports = {
    init: function (provider) {
        _provider = provider;
    },

    browse: function () {
        return _provider.browse();
    },

    getBaseEntry: function (store) {
        return _provider.getBaseEntry(store);
    },

    getEntryId: function (entry) {
        return _provider.getEntryId(entry);
    },

    getEntryPath: function (entry) {
        return _provider.getEntryPath(entry);
    },

    getLocalBaseUrl: function (entry) {
        return _provider.getLocalBaseUrl(entry);
    },

    listLocal: function (currentUrl, baseEntry) {
        return _provider.listLocal(currentUrl, baseEntry);
    },

    listWeb: function (currentUrl) {
        const ADD_SLASH = !currentUrl.endsWith('/');
        const IGNORED_LINK_NAMES = ['parent directory', 'name', 'last modified', 'size', 'description'];

        function toAnchors(text) {
            return Array.from((new DOMParser()).parseFromString(text, 'text/html').getElementsByTagName('a'));
        }

        function toLink(anchor) {
            let href = anchor.getAttribute('href');
            // The directory index may contain shortened path names, which end in "..>".
            const name = utils.toName(anchor.textContent.replace('..>', '…'));

            if (!href.startsWith('.') && IGNORED_LINK_NAMES.indexOf(name.toLowerCase()) == -1) {
                if (ADD_SLASH && !href.startsWith('/')) {
                    href = '/' + href;
                }
                return {name: name, url: currentUrl + href};
            }
        }

        // Use superagent instead of the native fetch api because the latter fails in Chrome 49 with the following
        // error when used with http basic authentication:
        //  http basic auth: Failed to execute 'fetch' on 'Window': Request cannot be constructed from a URL that
        //  includes credentials
        return new Promise(function(resolve) {
            superagent.get(currentUrl).end(function(error, response) {
                resolve(error ? [] : utils.compact(toAnchors(response.text).map(toLink)));
            });
        });
    },

    makeUrl: function (url, baseEntry) {
        return _provider.makeUrl(url, baseEntry);
    },

    revokeUrl: function (url) {
        _provider.revokeUrl(url)
    }
};