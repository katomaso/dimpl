'use strict';

const App = require('./components/app');
const navigationStore = require('./stores/navigation');
const fileSystem = require('./file-system/index');
const playerStore = require('./stores/player');
const React = require('react');
const ReactDOM = require('react-dom');

let fsProvider;
let storeProvider;

if (typeof chrome == 'undefined') {
    fsProvider = require('./file-system/providers/electron');
    storeProvider = require('./stores/providers/electron');
} else {
    fsProvider = require('./file-system/providers/chrome');
    storeProvider = require('./stores/providers/chrome');
}

fileSystem.init(fsProvider);

Promise.all([navigationStore.init(storeProvider), playerStore.init(storeProvider)])
    .then(function () {
        ReactDOM.render(<App />, document.getElementById('app'));
    });