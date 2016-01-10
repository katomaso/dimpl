'use strict';

const path = require('path');
const utils = require('../../utils');

/*
 * Electron provides `window.require`, whereas Browserify overwrite `require`.
 */
const remote = window.require('remote');
const dialog = remote.require('dialog');
const fs = remote.require('fs');

module.exports = {
    browse: function () {
        return new Promise(function (resolve) {
            dialog.showOpenDialog(
                null,
                {properties: ['openDirectory']},
                function (filenames) {
                    resolve(typeof filenames !== 'undefined' ? filenames[0] : null);
                }
            );
        });
    },

    getBaseEntry: function (store) {
        const baseId = store.baseId;

        return Promise.resolve([baseId, baseId]);
    },

    getEntryId: function (entry) {
        return entry;
    },

    getEntryPath: function (entry) {
        return Promise.resolve(entry);
    },

    getLocalBaseUrl: function (entry) {
        return entry + path.sep;
    },

    listLocal: function (currentUrl, baseEntry) {
        const cwd = currentUrl || baseEntry;

        const parseFile = function (url) {
            url = path.join(cwd, url);
            if (fs.statSync(url).isDirectory()) {
                url += path.sep;
            }
            return {name: utils.toName(path.basename(url)), url: url};
        };

        return new Promise(function (resolve) {
            fs.readdir(cwd, function (err, files) {
                if (files) {
                    resolve(utils.sortBy(files.map(parseFile), 'name'));
                }
            });
        });
    },

    makeUrl: function (url) {
        return Promise.resolve('file://' + url);
    },

    revokeUrl: function () {
        // No-op.
    }
};