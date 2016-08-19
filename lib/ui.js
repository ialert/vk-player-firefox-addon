"use strict";

//Include sdk helpers
const self = require("sdk/self");
const tabs = require('sdk/tabs');

const ActionButton = require('sdk/ui/button/action').ActionButton;
const ToggleButton = require("sdk/ui/button/toggle").ToggleButton;
const Toolbar = require("sdk/ui/toolbar").Toolbar;

const Panels = require("sdk/panel");

const Config = require("sdk/simple-storage");


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

        this.initButtons();
        this.initPanel();
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
            contentScriptFile: self.data.url("playlist-worker.js"),
            onHide: this.hidePanel.bind(this),
        });
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

    }

    /**
     * Next button click handler
     */
    nextTrack() {

    }

    /**
     * Play/Pause button click handler
     */
    playTrack() {


    }

    /**
     * Show modal window with playlist handler
     */
    showPlaylist(state) {

        if (state.checked) {

            this.setPlaylist();

            this._panel.show({
                position: this._buttons['music-button']
            });
        }

    }

    setPlaylist() {

    	
    }
}

exports.Player = VkPlayerUI;