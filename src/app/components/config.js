'use strict';

const ConfigForm = require('./config-form');
const KeybindingMixin = require('react-keybinding-mixin');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const React = require('react');

module.exports = React.createClass({
    mixins: [PureRenderMixin, KeybindingMixin],

    propTypes: {
        basePath: React.PropTypes.string.isRequired,
        baseUrl: React.PropTypes.string.isRequired,
        isLocal: React.PropTypes.bool.isRequired,
        regexes: React.PropTypes.array.isRequired
    },

    componentDidMount: function () {
        this.onKey('m', this.handleClick);
        this.onKey('o', this.handleClick);
    },

    getInitialState: function () {
        return {
            isOpen: !this.props.baseUrl
        };
    },

    handleClick: function (event) {
        event.preventDefault();
        this.setState({isOpen: !this.state.isOpen});
    },

    handleSubmit: function () {
        this.setState({isOpen: false});
    },

    render: function () {
        const props = this.props;
        const form = !this.state.isOpen ? null : (
            <ConfigForm
                baseUrl={props.baseUrl}
                handleSubmit={this.handleSubmit}
                isLocal={props.isLocal}
                basePath={props.basePath}
                regexes={props.regexes}/>
        );
        return (
            <section className="config">
                <div>
                    <a
                        href=""
                        className="config__menu"
                        onClick={this.handleClick}
                        title="Menu">☰</a>
                    {form}
                </div>
            </section>
        );
    }
});
