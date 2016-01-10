'use strict';

const utils = require('../utils');

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

        function status(response) {
            if (200 <= response.status < 300) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }

        function html(response) {
            return response.text();
        }

        function links(text) {
            return utils.compact(toAnchors(text).map(toLink));
        }

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

        return fetch(currentUrl, {credentials: 'include', mode: 'cors'}).then(status).then(html).then(links);
    },

    makeUrl: function (url, baseEntry) {
        return _provider.makeUrl(url, baseEntry);
    },

    revokeUrl: function (url) {
        _provider.revokeUrl(url)
    }
};