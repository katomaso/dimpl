'use strict';

const RE_AUDIO = /\.(aac|mp3|oga|ogg|opus|wav|wave|weba)$/i;
const RE_VIDEO = /\.(mp4|ogv|webm)$/i;
const RE_UNDERSCORES = /_+/;
const RE_BASENAME_SPLIT = /^.*[\\\/]/;
const RE_ENDS_WITH_SLASH = /[\\\/]+$/;

module.exports = {
    basename: function (path) {
        path = path.replace(RE_ENDS_WITH_SLASH, '');
        return path.replace(RE_BASENAME_SPLIT, '');
    },

    compact: function (arr) {
        return arr.filter(function (n) {
            return n != undefined;
        })
    },

    immutableAdd: function (array, item) {
        return array.concat([item]);
    },

    immutableAppend: function (array, items) {
        return array.concat(items);
    },

    immutableRemoveIndex: function (array, idx) {
        return array.slice(0, idx).concat(array.slice(idx + 1))
    },

    immutableUpdateIndex: function (array, idx, value) {
        const newArray = array.slice();

        newArray[idx] = value;
        return newArray;
    },

    isAudio: function (path) {
        return path.search(RE_AUDIO) != -1
    },

    isVideo: function (path) {
        return path.search(RE_VIDEO) != -1
    },

    isDirectory: function (path) {
        return !!path.match(RE_ENDS_WITH_SLASH)
    },

    isLocal: function (path) {
        return !path.startsWith('http://') && !path.startsWith('https://');
    },

    sortBy: function (arr, name) {
        return arr.sort(function (a, b) {
            if (a[name] < b[name])
                return -1;
            if (a[name] > b[name])
                return 1;
            return 0;
        });
    },

    toName: function (path) {
        // Attempting to decode some paths such as "%.mp3" will raise an error.
        try {
            path = decodeURIComponent(path);
        } catch (e) {
        }
        return path.replace(RE_UNDERSCORES, ' ').trim();
    },

    toTitle: function (regexes, path) {
        let winner = [];

        path = decodeURIComponent(path);

        for (let regex of regexes) {
            let matched = path.match(regex);

            // There must be at least one capturing group.
            if (matched && matched.length > 1) {
                // Get capturing groups.
                matched = this.compact(matched.slice(1));
                if (matched.length > winner.length) {
                    // The regex with the most matches wins.
                    winner = matched;
                }
            }
        }
        path = winner.length ? winner.join(' • ') : this.basename(path);
        return this.toName(path);
    },

    upPath: function (path) {
        let parentPath = path.substr(0, path.lastIndexOf(this.basename(path)));

        if (!path.match(RE_ENDS_WITH_SLASH)) {
            parentPath = parentPath.replace(RE_ENDS_WITH_SLASH, '');
        }
        return parentPath
    }
};