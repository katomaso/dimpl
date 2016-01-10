'use strict';

const PureRenderMixin = require('react-addons-pure-render-mixin');
const React = require('react');
const utils = require('../utils');

const GROUPS = <a
    href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references"
    target="_blank">capturing groups</a>;
const REGEX = <a
    href="https://en.wikipedia.org/wiki/Regular_expression"
    target="_blank">regular expressions</a>;

module.exports = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
        onChange: React.PropTypes.func.isRequired,
        regexes: React.PropTypes.array.isRequired
    },

    handleAdd: function () {
        this.props.onChange(utils.immutableAdd(this.props.regexes, ''));
    },

    handleRemove: function () {
        const regexes = this.props.regexes;

        if (regexes.length) {
            this.props.onChange(utils.immutableRemoveIndex(regexes, regexes.length - 1));
        }
    },

    handleChange: function (i, event) {
        const regexes = this.props.regexes;
        const value = event.target.value;

        this.props.onChange(utils.immutableUpdateIndex(regexes, i, value));
    },

    render: function () {
        const inputs = this.props.regexes.map(function (regex, i) {
            return (
                <input
                    key={i}
                    onChange={this.handleChange.bind(this, i)}
                    required={i == 0}
                    type="text"
                    value={regex}/>
            );
        }.bind(this));

        return (
            <p className="regex">
                <label>Regular expressions</label>
                {inputs}
                <span className="regex__controls">
                    <button onClick={this.handleAdd} type="button">+</button>
                    <button onClick={this.handleRemove} type="button">-</button>
                </span>
                <small>
                    Each file URL will be matched against these {REGEX}.
                    The match with the most {GROUPS} will be used to compute
                    each file's title.
                </small>
            </p>
        );
    }
});