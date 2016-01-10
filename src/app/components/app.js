'use strict';

const Config = require('./config');
const KeybindingMixin = require('react-keybinding-mixin');
const Navigation = require('./navigation');
const NavigationStore = require('../stores/navigation');
const Player = require('./player');
const PlayerStore = require('../stores/player');
const Playlist = require('./playlist');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const React = require('react');

function getState() {
    return {
        baseEntry: NavigationStore.getBaseEntry(),
        basePath: NavigationStore.getBasePath(),
        baseUrl: NavigationStore.getBaseUrl(),
        currentUrl: NavigationStore.getCurrentUrl(),
        isLocal: NavigationStore.isLocal(),
        regexes: NavigationStore.getRegexes(),

        isShuffle: PlayerStore.isShuffle(),
        mediaUrl: PlayerStore.getMediaUrl(),
        playlist: PlayerStore.getPlaylist(),
        playlistIndex: PlayerStore.getPlaylistIndex()
    };
}

module.exports = React.createClass({
    mixins: [PureRenderMixin, KeybindingMixin],

    componentDidMount: function () {
        NavigationStore.addChangeListener(this.handleChange);
        PlayerStore.addChangeListener(this.handleChange);

        this.onKey('g', this._scrollTop);
        this.onKey('g', this._scrollBottom, {shift: true});
    },

    componentWillUnmount: function () {
        NavigationStore.removeChangeListener(this.handleChange);
        PlayerStore.removeChangeListener(this.handleChange);
    },

    getInitialState: getState,

    handleChange: function () {
        this.setState(getState());
    },

    render: function () {
        const state = this.state;

        return (
            <div>
                <div>
                    <Config
                        baseUrl={state.baseUrl}
                        basePath={state.basePath}
                        isLocal={state.isLocal}
                        regexes={state.regexes}/>
                    <Navigation
                        baseEntry={state.baseEntry}
                        baseUrl={state.baseUrl}
                        currentUrl={state.currentUrl}
                        isLocal={state.isLocal}/>
                </div>
                <div>
                    <Player
                        baseEntry={state.baseEntry}
                        mediaUrl={state.mediaUrl}
                        regexes={state.regexes}/>
                    <Playlist
                        isShuffle={state.isShuffle}
                        playlist={state.playlist}
                        playlistIndex={state.playlistIndex}
                        regexes={state.regexes}/>
                </div>
            </div>
        );
    },

    _scrollBottom: function () {
        window.scrollTo(0, document.body.scrollHeight);
    },

    _scrollTop: function () {
        window.scrollTo(0, 0);
    }
});
