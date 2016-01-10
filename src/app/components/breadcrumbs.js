'use strict';

const PureRenderMixin = require('react-addons-pure-render-mixin');
const React = require('react');
const utils = require('../utils');

module.exports = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
        breadcrumbs: React.PropTypes.array.isRequired,
        handleNavigate: React.PropTypes.func.isRequired
    },

    render: function () {
        const props = this.props;

        const breadcrumbs = props.breadcrumbs.map(function (url, i) {
            let className = 'breadcrumbs__item';
            let name;
            let title;

            if (i == 0) {
                className += ' breadcrumbs__item--root';
                name = '⌂';
                title = 'Shortcut: ctrl + b'
            } else {
                className += ' breadcrumbs__item--subdir';
                name = utils.toName(utils.basename(url));
                title = 'Shortcut: b or backspace'
            }
            return (
                <li key={i} className={className}>
                    <a
                        href={url}
                        onClick={props.handleNavigate}
                        title={title}>{name}</a>
                </li>
            );
        });

        return <ul className="breadcrumbs">{breadcrumbs}</ul>;
    }
});