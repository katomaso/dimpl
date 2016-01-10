'use strict';

const utils = require('../../utils');

module.exports = {
    browse: function () {
        return new Promise(function (resolve) {
            chrome.fileSystem.chooseEntry({type: 'openDirectory'}, function (entry) {
                if (chrome.runtime.lastError) {
                    resolve(null);
                } else {
                    resolve(entry);
                }
            }.bind(this));
        });
    },

    getBaseEntry: function (store) {
        return new Promise(function (resolve) {
            const baseId = store.baseId;

            if (baseId) {
                chrome.fileSystem.restoreEntry(baseId, function (entry) {
                    if (chrome.runtime.lastError) {
                        resolve([null, '']);
                    } else {
                        chrome.fileSystem.getDisplayPath(entry, function (displayPath) {
                            resolve([entry, displayPath]);
                        });
                    }
                });
            } else {
                resolve([null, '']);
            }
        });
    },

    getEntryId: function (entry) {
        return chrome.fileSystem.retainEntry(entry);
    },

    getEntryPath: function (entry) {
        return new Promise(function (resolve) {
            chrome.fileSystem.getDisplayPath(entry, function (path) {
                resolve(path);
            });
        });
    },

    getLocalBaseUrl: function () {
        return '';
    },

    listLocal: function (currentUrl, baseEntry) {
        const parseEntry = function (entry) {
            let url = entry.fullPath.substr(baseEntry.fullPath.length + 1);

            if (entry.isDirectory) {
                url += '/';
            }
            return {name: utils.toName(utils.basename(url)), url: url};
        };

        return new Promise(function (resolve) {
            baseEntry.getDirectory(currentUrl, {}, function (dirEntry) {
                const reader = dirEntry.createReader();
                let result = [];

                // https://developer.mozilla.org/en-US/docs/Web/API/DirectoryReader#readEntries
                // "Call this method until an empty array is returned."
                const readSomeEntries = function () {
                    reader.readEntries(function (entries) {
                        if (entries.length) {
                            result = result.concat(entries);
                            readSomeEntries();
                        } else {
                            result = result.map(parseEntry);
                            resolve(utils.sortBy(result, 'name'));
                        }
                    });
                };
                readSomeEntries();
            });
        });
    },

    makeUrl: function (url, baseEntry) {
        if (baseEntry) {
            return new Promise(function (resolve) {
                baseEntry.getFile(url, {}, function (fileEntry) {
                    if (fileEntry) {
                        fileEntry.file(function (file) {
                            resolve(URL.createObjectURL(file));
                        }, function () {
                            resolve('');
                        });
                    } else {
                        resolve('');
                    }
                });
            });
        }
        return Promise.resolve('');
    },

    revokeUrl: function (url) {
        URL.revokeObjectURL(url);
    }
};