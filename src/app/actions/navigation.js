'use strict';

const actions = require('../constants').actions;
const dispatcher = require('../dispatcher');

module.exports = {
    changeBaseEntry: function (text) {
        dispatcher.dispatch({
            type: actions.CHANGE_BASE_ENTRY,
            text: text
        });
    },

    changeBaseUrl: function (text) {
        dispatcher.dispatch({
            type: actions.CHANGE_BASE_URL,
            text: text
        });
    },

    changeCurrentUrl: function (text) {
        dispatcher.dispatch({
            type: actions.CHANGE_CURRENT_URL,
            text: text
        });
    },

    changeIsLocal: function (text) {
        dispatcher.dispatch({
            type: actions.CHANGE_IS_LOCAL,
            text: text
        });
    },

    resetRegexes: function (list) {
        dispatcher.dispatch({
            type: actions.RESET_REGEXES,
            list: list
        });
    }
};
