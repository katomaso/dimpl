'use strict';

const PureRenderMixin = require('react-addons-pure-render-mixin');
const React = require('react');

module.exports = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
        handleNext: React.PropTypes.func.isRequired,
        handlePlay: React.PropTypes.func.isRequired,
        handlePrevious: React.PropTypes.func.isRequired,
        isPlaying: React.PropTypes.bool.isRequired
    },

    render: function () {
        const className = 'player-controls__control';
        const playModifier = this.props.isPlaying ? '--pause' : '--play';

        return (
            <p className="player-controls">
                <button
                    className={className + ' ' + className + '--rw'}
                    onClick={this.props.handlePrevious}
                    title="Shortcut: h or left-arrow"></button>
                <button
                    className={className + ' ' + className + playModifier}
                    onClick={this.props.handlePlay}
                    title="Shortcut: p or space"/>
                <button
                    className={className + ' ' + className + '--ff'}
                    onClick={this.props.handleNext}
                    title="Shortcut: l or right-arrow"></button>
            </p>
        );
    }
});