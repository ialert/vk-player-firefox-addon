(function(APP) {
    "use strict";


    /**
     * AudioPlayer class
     * use html5 audio player for playing audio.
     */
    class AudioPlayer {


        constructor(audioElement) {

            this.handler = audioElement || new window.Audio();
            this.tracks = [];

            this._currentTrack = 0;
            this.playing = false;

        }

        /**
         * Get playlist
         * @return {Array} playlist array
         */
        get playlist() {

        	return this.tracks;
        }

        /**
         * Set playlist
         * @param  {Array} playlist Playlist array
         */
        set playlist(playlist) {

            this._currentTrack = 0;

            if(this.playing) {

                this.playing = false;
                this.stop();
            }

        	this.tracks = playlist;
        }

        /**
         * Register event for audio handler objecet
         */
        registerEvent(event,callback) {

            this.handler.addEventListener(event,callback);
        }

        /**
         * Get current track object
         * @return {Object|boolean} Track object or false
         */
        get currentTrack() {

            return this.tracks[this._currentTrack] ? this.tracks[this._currentTrack] : false;
        }

        /**
         * Get current track number
         * @return {integer} Track number
         */
        get currentTrackNumber() {

        	return this._currentTrack;
        }

        /**
         * Check is playing now
         * @return {Boolean} True if playing or false
         */
        isPlaying() {

        	return this.playing;
        }

        /**
         * Set current track number in playlist
         * @param  {integer} track Track number
         */
        set currentTrackNumber(trackNumber) {

            this._currentTrack = trackNumber;
        }

        /**
         * Switch player state to playing
         */
        play() {

            if (!this.playing) {

                const track = '';

                if (this.currentTrack) {

                    this._setTrack(this.currentTrack.url);
                    this.playing = true;
                    this._play();
                }
            }

            this._play();

        }

        /**
         * Switch player state to pause
         */
        pause() {

            this.playing = false;
            this._pause();

        }

        /**
         * Switch player state to stop
         */
        stop() {

            if (this.playing) this.pause();

            this._load();
        }

        /**
         * Set next track in playlist
         */
        next() {

            this.stop();
            this._setNext();
        }

        /**
         * Set prev track in playlist
         */
        prev() {

            this.stop();
            this._setPrev();
        }

        /**
         * Set track url in handler
         * @param {String} url Track url
         */
        _setTrack(url) {

            this.handler.src = url;
        }

        /**
         * Switch handler state to playing
         */
        _play() {

            this.handler.play();
        }

        /**
         * Switch handler state to pause
         */
        _pause() {

            this.handler.pause();
        }

        /**
         * Call handler load method
         */
        _load() {

            this.handler.load();
        }

        /**
         * Set next track key or first track if playlist ended
         */
        _setNext() {

            if (this.currentTrack != this.tracks.length - 1) {

                this.currentTrack++;

            } else {

                this.currentTrack = 0;
            }
        }

        /**
         * Set prev track key or last if playlist ended
         */
        _setPrev() {

            if (this.currentTrack == 0) {

                this.currentTrack = this.tracks.length - 1;

            } else {

                this.currentTrack--;
            }
        }

        /**
         * Set next track && play it.
         */
        _playNextTrack() {

            this.next();
            this.play();
        }

    }

    APP.Player = AudioPlayer;

})(window);
