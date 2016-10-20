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

            this.loadCurrentTrack();

            this.registerEvent('error',this._stopPlaying);
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

            if (this.playing) {

                this.playing = false;
                this.stop();
            }

            this.tracks = playlist;

            this.loadCurrentTrack();
        }

        /**
         * Register event for audio handler objecet
         */
        registerEvent(event, callback) {

            this.handler.addEventListener(event, callback);
        }

        /**
         * Get current track object
         * @return {Object|boolean} Track object or false
         */
        get currentTrack() {

            return this.tracks[this._currentTrack] ? this.tracks[this._currentTrack] : false;
        }

        /**
         * Load current track in audio handler
         */
        setCurrentTrack() {

            if (this.currentTrack !== false) {

                this._setTrack(this.currentTrack.url);
            }
        }

        /**
         * Get current track number
         * @return {integer} Track number
         */
        get currentTrackNumber() {

            return this._currentTrack;
        }

        /**
         * Set current track number in playlist
         * @param  {integer} track Track number
         */
        set currentTrackNumber(trackNumber) {

            this._currentTrack = trackNumber;
        }

        /**
         * Load current track in handler
         */
        loadCurrentTrack() {

            if (this.currentTrack !== false) {

                this._setTrack(this.currentTrack.url);
            }
        }

        /**
         * Check is playing now
         * @return {Boolean} True if playing or false
         */
        isPlaying() {

            return this.playing;
        }



        /**
         * Switch player state to playing
         */
        play() {

            this.playing = true;
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

            if (this.currentTrackNumber != this.tracks.length - 1) {

                this.currentTrackNumber++;

            } else {

                this.currentTrackNumber = 0;
            }

            this.loadCurrentTrack();
        }

        /**
         * Set prev track key or last if playlist ended
         */
        _setPrev() {

            if (this.currentTrackNumber == 0) {

                this.currentTrackNumber = this.tracks.length - 1;

            } else {

                this.currentTrackNumber--;
            }

            this.loadCurrentTrack();
        }

        /**
         * Get error message from error code
         * @param  {integer} code error code
         * @return {String}      error message
         */
        getErrorMessage(code) {

            let msg = '';

            switch (code) {
                case e.target.error.MEDIA_ERR_ABORTED:
                    msg = 'You aborted the media playback.';
                    break;
                case e.target.error.MEDIA_ERR_NETWORK:
                    msg = 'A network error caused the media download to fail.';
                    break;
                case e.target.error.MEDIA_ERR_DECODE:
                    msg = 'The media playback was aborted due to a corruption problem or because the media used features your browser did not support.';
                    break;
                case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    msg = 'The media could not be loaded, either because the server or network failed or because the format is not supported.';
                    break;
                default:
                    msg = 'An unknown media error occurred.';
            }

            return msg;
        }

        /**
         * Switch player state when error occurred
         */
        _stopPlaying() {

            this.playing = false;
            this.stop();
        }

    }

    APP.Player = AudioPlayer;

})(window);