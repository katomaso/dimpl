'use strict';

const Breadcrumbs = require('./breadcrumbs');
const fileSystem = require('../file-system/index');
const KeybindingMixin = require('react-keybinding-mixin');
const navigationActions = require('../actions/navigation');
const NavigationList = require('./navigation-list');
const playerActions = require('../actions/player');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const React = require('react');
const utils = require('../utils');

function applyFilter(links, filter) {
    return links.filter(function (link) {
        return !filter || link.name.toLowerCase().indexOf(filter) != -1;
    });
}

function makeLinksState(links) {
    const directories = [];
    const files = [];

    for (let link of links) {
        const url = link.url;

        if (utils.isDirectory(url)) {
            directories.push(link);
        } else if (utils.isAudio(url) || utils.isVideo(url)) {
            files.push(link);
        }
    }
    return {directories: directories, files: files};
}

function makeBreadcrumbsState(basePath, path) {
    const len = basePath.length;
    const breadcrumbs = [];

    while (path.length > len && ['/', '\\'].indexOf(path.substr(len)) == -1) {
        breadcrumbs.push(path);
        path = utils.upPath(path);
    }
    breadcrumbs.push(basePath);
    breadcrumbs.reverse();
    return {'breadcrumbs': breadcrumbs};
}

module.exports = React.createClass({
    mixins: [PureRenderMixin, KeybindingMixin],

    propTypes: {
        baseEntry: React.PropTypes.any,
        baseUrl: React.PropTypes.string.isRequired,
        currentUrl: React.PropTypes.string.isRequired,
        isLocal: React.PropTypes.bool.isRequired
    },

    componentDidMount: function () {
        const KEYS = this.KEYS;

        this.onKey(KEYS.BACKSPACE, this._back);
        this.onKey(KEYS.BACKSPACE, this._backToRoot, {ctrl: true});
        this.onKey('b', this._back);
        this.onKey('b', this._backToRoot, {ctrl: true});
        this.onKey(KEYS.ENTER, this._forward, {input: true});
        this.onKey('f', this._forward);
        this.onKey(KEYS.FORWARD_SLASH, this._focusFilter);
        this.onKey('a', this.handleAddAll);
        this.onKey(KEYS.ESC, this._clearFilter);
        this.onKey(KEYS.ESC, this._blurFilter, {input: true});
        this._fetchState(this.props);
    },

    componentWillReceiveProps: function (nextProps) {
        const props = this.props;

        if (props.baseEntry != nextProps.baseEntry
            || props.baseUrl != nextProps.baseUrl
            || props.currentUrl != nextProps.currentUrl
            || props.isLocal != nextProps.isLocal) {
            this._fetchState(nextProps);
        }
    },

    getInitialState: function () {
        return {
            breadcrumbs: [],
            directories: [],
            files: [],
            filter: '',
            isLoading: false,
            selectedIndex: 0
        };
    },

    handleAdd: function (event) {
        event.preventDefault();
        playerActions.addUrl(event.target.getAttribute('href'));
    },

    handleAddAll: function () {
        const urls = this.state.files.map(function (o) {
            return o.url;
        });

        event.preventDefault();
        playerActions.appendPlaylist(urls);
    },

    handleSelectIndex: function (selectedIndex) {
        this.setState({selectedIndex: selectedIndex});
    },

    handleFilter: function (event) {
        this.setState({filter: event.target.value.toLowerCase(), selectedIndex: 0});
    },

    handleNavigate: function (event) {
        event.preventDefault();
        navigationActions.changeCurrentUrl(event.target.getAttribute('href'));
    },

    render: function () {
        const state = this.state;
        const directories = applyFilter(state.directories, state.filter);
        const files = applyFilter(state.files, state.filter);
        const addButton = !files ? null : (
            <button
                className="navigation-controls__add-all"
                onClick={this.handleAddAll}
                title="Shortcut: a">Add all files</button>);

        return (
            <section className="navigation">
                <Breadcrumbs
                    breadcrumbs={state.breadcrumbs}
                    handleNavigate={this.handleNavigate}/>
                <div className="navigation-controls">
                    <input
                        className="navigation-controls__filter"
                        onChange={this.handleFilter}
                        placeholder="Filter"
                        ref="filter"
                        value={state.filter}/>
                    {addButton}
                </div>
                <NavigationList
                    directories={directories}
                    files={files}
                    handleAdd={this.handleAdd}
                    handleSelectIndex={this.handleSelectIndex}
                    handleNavigate={this.handleNavigate}
                    isLoading={state.isLoading}
                    selectedIndex={state.selectedIndex}/>
            </section>
        );
    },

    _back: function () {
        const breadcrumbs = this.state.breadcrumbs;
        const len = breadcrumbs.length;

        if (len > 1) {
            navigationActions.changeCurrentUrl(breadcrumbs[len - 2]);
        }
    },

    _backToRoot: function () {
        const breadcrumbs = this.state.breadcrumbs;

        if (breadcrumbs.length) {
            navigationActions.changeCurrentUrl(breadcrumbs[0]);
        }
    },

    _blurFilter: function () {
        this.refs.filter.blur();
    },

    _clearFilter: function () {
        this._blurFilter();
        this.setState({filter: '', selectedIndex: 0});
    },

    _focusFilter: function (event) {
        event && event.preventDefault();
        this.refs.filter.focus();
    },

    _forward: function () {
        const state = this.state;
        const idx = state.selectedIndex;
        let link;

        function getLink(links) {
            return applyFilter(links, state.filter)[idx];
        }

        link = getLink(state.directories);
        if (link) {
            navigationActions.changeCurrentUrl(link.url);
            this._blurFilter();
        }
        link = getLink(state.files);
        if (link) {
            playerActions.addUrl(link.url);
            this._blurFilter();
        }
    },

    _fetchState: function (props) {
        const currentUrl = props.currentUrl;
        let baseUrl;
        let promise;

        if (props.isLocal) {
            baseUrl = fileSystem.getLocalBaseUrl(props.baseEntry);
            if (props.baseEntry) {
                promise = fileSystem.listLocal(props.currentUrl, props.baseEntry);
            }
        } else {
            baseUrl = props.baseUrl;
            if (props.currentUrl) {
                promise = fileSystem.listWeb(props.currentUrl);
            }
        }
        if (promise) {
            const breadcrumbState = makeBreadcrumbsState(baseUrl, currentUrl);

            this.setState(Object.assign(this.getInitialState(), {isLoading: true}, breadcrumbState));

            promise.then(function (links) {
                // If the breadcrumbState does not match then a subsequent _fetchState() request must have
                // completed before this one, so these links have been superseded.
                if (this.state.breadcrumbs == breadcrumbState.breadcrumbs) {
                    this.setState(Object.assign({isLoading: false}, makeLinksState(links)));
                }
            }.bind(this));
        }
    }
});
