'use strict';

const fileSystem = require('../file-system/index');
const KeybindingMixin = require('react-keybinding-mixin');
const playerActions = require('../actions/player');
const PlayerControls = require('./player-controls');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const React = require('react');
const utils = require('../utils');

function getSrc(baseEntry, mediaUrl, previousUrl) {
    if (previousUrl && utils.isLocal(previousUrl)) {
        fileSystem.revokeUrl(previousUrl);
    }
    if (!mediaUrl) {
        return Promise.resolve('');
    } else if (utils.isLocal(mediaUrl)) {
        return fileSystem.makeUrl(mediaUrl, baseEntry);
    } else {
        return Promise.resolve(mediaUrl);
    }
}

module.exports = React.createClass({
    mixins: [PureRenderMixin, KeybindingMixin],

    propTypes: {
        baseEntry: React.PropTypes.any,
        mediaUrl: React.PropTypes.string.isRequired,
        regexes: React.PropTypes.array.isRequired
    },

    componentDidMount: function () {
        const KEYS = this.KEYS;
        const player = this.refs.player;
        const props = this.props;

        this.onKey('h', this._seek.bind(this, -0.05), {shift: true});
        this.onKey(KEYS.LEFT, this._seek.bind(this, -0.05), {shift: true});
        this.onKey('l', this._seek.bind(this, 0.05), {shift: true});
        this.onKey(KEYS.RIGHT, this._seek.bind(this, 0.05), {shift: true});
        this.onKey('p', this.handlePlay);
        this.onKey(KEYS.SPACE, this.handlePlay);

        player.addEventListener('ended', this.handleNext);
        player.addEventListener('timeupdate', this.handleProgress);

        getSrc(props.baseEntry, props.mediaUrl, null).then(function (src) {
            this.setState({'src': src});
        }.bind(this));
    },

    componentWillUnmount: function () {
        const player = this.refs.player;

        player.removeEventListener('ended', this.handleNext);
        player.removeEventListener('timeupdate', this.handleProgress);
    },

    componentWillReceiveProps: function (nextProps) {
        const baseEntry = nextProps.baseEntry;
        const nextUrl = nextProps.mediaUrl;
        const previousUrl = this.state.src;

        if (nextUrl && nextUrl != this.props.mediaUrl) {
            this.setState(this.getInitialState());

            getSrc(baseEntry, nextUrl, previousUrl).then(function (src) {
                this.setState({isPlaying: !!src, 'src': src});
            }.bind(this));
        }
    },

    getInitialState: function () {
        return {
            currentTime: 0, // Seconds.
            duration: 0, // Seconds.
            isPlaying: false,
            src: ''
        };
    },

    handleNext: function () {
        playerActions.seek(1);
    },

    handlePrevious: function () {
        playerActions.seek(-1);
    },

    handlePopout: function () {
        // Event-bubbling is not prevented, so a new browser window will be
        // opened to the web-address of the video file.
        const player = this.refs.player;

        player.pause();
        this.setState({isPlaying: false});
    },

    handleProgress: function () {
        const player = this.refs.player;

        this.setState({
            currentTime: player.currentTime,
            duration: player.duration
        });
    },

    handleSeek: function (event) {
        const player = this.refs.player;

        if (player.duration) {
            let pct = event.nativeEvent.offsetX / event.target.clientWidth * 100;
            player.currentTime = Math.floor(player.duration * pct / 100);
        }
    },

    _seek: function (delta_pct) {
        const player = this.refs.player;
        const duration = player.duration;

        if (duration) {
            let newTime = player.currentTime + (duration * delta_pct);

            if (newTime > duration) {
                newTime = duration;
            } else if (newTime < 0) {
                newTime = 0;
            }
            player.currentTime = newTime;
        }

    },

    handlePlay: function (event) {
        event && event.preventDefault();
        const player = this.refs.player;
        const isPlaying = !player.paused;

        if (player.getAttribute('src')) {
            if (isPlaying) {
                player.pause();
            } else {
                player.play();
            }
            this.setState({isPlaying: !isPlaying});
        } else {
            playerActions.next();
        }
    },

    render: function () {
        const mediaUrl = this.props.mediaUrl;
        const title = mediaUrl ? utils.toTitle(this.props.regexes, mediaUrl) : '';
        const state = this.state;
        const duration = state.duration;
        const currentTime = state.currentTime;
        let currentTimeMins = '';
        let currentTimePct = 0;

        if (duration) {
            let secs = Math.floor(currentTime % 60);

            if (secs < 10) {
                secs = '0' + secs;
            }
            currentTimeMins = Math.floor(currentTime / 60) + ':' + secs;
            currentTimePct = currentTime / duration * 100;
        }
        return (
            <section className="player">
                <a
                    className={utils.isVideo(mediaUrl) ? '' : 'is-hidden'}
                    href={state.src}
                    onClick={this.handlePopout}
                    target="_blank"
                    title="Click to open in a browser window">
                    <video
                        autoPlay={state.isPlaying}
                        preload="auto"
                        ref="player"
                        src={state.src}/>
                </a>
                <PlayerControls
                    handleNext={this.handleNext}
                    handlePlay={this.handlePlay}
                    handlePrevious={this.handlePrevious}
                    isPlaying={state.isPlaying}/>
                <p className="player__title">{title}</p>
                <p className="player__progress">
                    <progress
                        max="100"
                        onClick={this.handleSeek}
                        title="Rewind: shift + h | Fast-forward: shift + l"
                        value={currentTimePct}/>
                    <span>{currentTimeMins}</span>
                </p>
            </section>
        );
    }
});