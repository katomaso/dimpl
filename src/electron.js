'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');
var mainWindow;

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({width: 1024, height: 768});
    mainWindow.loadUrl('file://' + __dirname + '/index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});