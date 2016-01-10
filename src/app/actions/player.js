'use strict';

const actions = require('../constants').actions;
const dispatcher = require('../dispatcher');

module.exports = {
    addUrl: function (text) {
        dispatcher.dispatch({
            type: actions.ADD_URL,
            text: text
        });
    },

    appendPlaylist: function (list) {
        dispatcher.dispatch({
            type: actions.APPEND_PLAYLIST,
            list: list
        });
    },

    clearPlaylist: function () {
        dispatcher.dispatch({
            type: actions.CLEAR_PLAYLIST
        });
    },

    seek: function (number) {
        dispatcher.dispatch({
            type: actions.SEEK,
            number: number
        });
    },

    seekBottom: function (number) {
        dispatcher.dispatch({
            type: actions.SEEK_BOTTOM
        });
    },

    seekTop: function (number) {
        dispatcher.dispatch({
            type: actions.SEEK_TOP
        });
    },

    playIndex: function (number) {
        dispatcher.dispatch({
            type: actions.PLAY_INDEX,
            number: number
        });
    },

    removeIndex: function (number) {
        dispatcher.dispatch({
            type: actions.REMOVE_INDEX,
            number: number
        });
    },

    toggleShuffle: function () {
        dispatcher.dispatch({
            type: actions.TOGGLE_SHUFFLE
        });
    }
};