"use strict";

//Include sdk helpers
const self = require("sdk/self");
const tabs = require('sdk/tabs');

const ActionButton = require('sdk/ui/button/action').ActionButton;
const ToggleButton = require("sdk/ui/button/toggle").ToggleButton;
const Toolbar = require("sdk/ui/toolbar").Toolbar;

const Panels = require("sdk/panel");

const Config = require("./config");

const VK = require("./vk-api").vk;

class VkPlayerUI {

    constructor(options) {

        this.options = Object.assign({}, {
            loginWindow: {
                width: 250,
                height: 200,
            },
            playlistWindow: {
                width: 300,
                height: 900,
            }
        }, options);

        this._buttons = {};
        this._panel = {};

        this.init();
    }

    /**
     * Init actions when object created
     */
    init() {

        this.vk = new VK({
            client_id: this.options.client_id,
        });

        const accessToken = Config.get('accessToken');

        this.vk.accessToken = accessToken;

        this.initButtons();
        this.initPanel();
        this.registerEvents();
    }

    /**
     * Init ui buttons(navigate to next,prev track && playing/pause)
     */
    initButtons() {

        this._buttons["prev-button"] = ActionButton({
            id: "prev-button",
            label: "Previous Track VK",
            icon: this.getIcons('prev'),
            onClick: this.prevTrack.bind(this),
        });

        this._buttons["play-button"] = ActionButton({
            id: "play-button",
            label: "Play/Pause Track VK",
            icon: this.getIcons('play'),
            onClick: this.playTrack.bind(this),
        });

        this._buttons["next-button"] = ActionButton({
            id: "next-button",
            label: "Next Track VK",
            icon: this.getIcons('next'),
            onClick: this.nextTrack.bind(this),
        });

        this._buttons["music-button"] = ToggleButton({
            id: "music-button",
            label: "Show Vk Playlist",
            icon: this.getIcons('music'),
            onChange: this.showPlaylist.bind(this),
        });
    }

    /**
     * Init modal window for showing playlist
     */
    initPanel() {

        this._panel = Panels.Panel({
            contentURL: self.data.url("playlist.html"),
            contentStyleFile: self.data.url("playlist-style.css"),
            contentScriptFile: [self.data.url("player-worker.js"), self.data.url("playlist-worker.js")],
            onHide: this.hidePanel.bind(this),
        });

        //load playlist in background for toolbar buttons
        this.setPlaylist();
    }

    /**
     * Calling after playlist window hide
     */
    hidePanel() {

        this._buttons['music-button'].state('window', {
            checked: false
        });
    }

    /**
     * Get buttons icons
     * @param  {String} buttonTitle Button title
     * @return {String}             Button image URI
     */
    getIcons(buttonTitle) {

        return "./images/" + buttonTitle + "-64.png";
    }

    /**
     *  Previous button click handler
     */
    prevTrack() {

        this._panel.port.emit("prev", true);
    }

    /**
     * Next button click handler
     */
    nextTrack() {

        this._panel.port.emit("next", true);
    }

    /**
     * Play/Pause button click handler
     */
    playTrack() {

        this._panel.port.emit("play");
    }

    /**
     * Show modal window with playlist handler
     */
    showPlaylist(state) {

        if (state.checked) {

            this._panel.show({
                position: this._buttons['music-button']
            });
        }

    }

    /**
     * Check is logged user && load music playlist
     */
    setPlaylist() {

        const accessToken = Config.get('accessToken');

        if (!accessToken) {

            this._panel.contentURL = self.data.url("login.html");
            this._panel.contentScriptFile = self.data.url("login-worker.js");
            this._panel.contentStyleFile = self.data.url("login-style.css"),
                this._panel.resize(this.options.loginWindow.width, this.options.loginWindow.height);
        } else {

            this._panel.resize(this.options.playlistWindow.width, this.options.playlistWindow.height);
        }

        this.vk.getAudio().then((response) => {

            this._panel.port.emit("loadPlaylist", response);
        });
    }

    /**
     * Register events
     */
    registerEvents() {

        this._panel.port.on("openAuthTab", (options) => {

            let url = this.vk.getAuthUrl("audio,offline");

            this._panel.hide();
            this.openTab(url);
        });

        this.registerTabEvent("ready", this.checkAccessTokenPage);
    }

    /**
     * Add event for browser tabs
     * @param  {String}   event    Event name
     * @param  {Function} callback Callback for event
     */
    registerTabEvent(event, callback) {

        tabs.on(event, tab => {

            callback.call(this, tab);
        });
    }

    /**
     * Browser new Tab open
     * @param  {String} url URL to open
     */
    openTab(url) {

        tabs.open(url);
    }

    /**
     * Browser Tab close
     * @param  {Object} tab tab object
     */
    closeTab(tab) {

        tab.close();
    }

    /**
     * Check is VK.com access token on new tab
     * @param  {Object} tab Tab object
     
     */
    checkAccessTokenPage(tab) {

        const accessTokenUrl = this.vk.getAccessTokenUrl();

        //if url match,parse access token
        if (tab.url.search(accessTokenUrl) != -1) {

            const accessToken = this._getAccessToken(tab.url);

            this.setConfig("accessToken", accessToken);
            this.vk.accessToken = accessToken;

            this.closeTab(tab);
        }
    }

    /**
     * Parse access token from URL
     * @param  {String} url Oauth Access Token url
     * @return {String}     Access token
     */
    _getAccessToken(url) {

        return url.match(/access_token=(.*?)&/i)[1];
    }
}

exports.Player = VkPlayerUI;