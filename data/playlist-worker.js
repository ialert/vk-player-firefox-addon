(function(APP) {
    "use strict";

    const loginContent = document.getElementById('login-content');
    const loginButton = document.getElementById('auth-button');

    const playlistContent = document.getElementById('playlist-content');
    const playlistItem = document.getElementById('playlist');
    const trackTemplate = document.getElementById('audio_item');

    const CSS_HIDDEN_CLASS = 'hidden';
    const CSS_PLAYING_CLASS = 'playing';

    const audioPlayer = new Player(false);

    function getDuration(secs) {

        const sec_num = parseInt(secs, 10)
        const hours = Math.floor(sec_num / 3600) % 24
        const minutes = Math.floor(sec_num / 60) % 60
        const seconds = sec_num % 60
        return [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i > 0)
            .join(":")
    }

    function buildTrackTemplate(audio, template, i) {

        template = template
            .replace(/%number%/g, i)
            .replace("%author%", audio.artist)
            .replace("%title%", audio.title)
            .replace("%duration%", getDuration(audio.duration));

        return template;
    }

    function playHandler() {

        if (!this.classList.contains('playing')) {

            let loadTrack = this.dataset.number;
            let currentTrack = audioPlayer.currentTrackNumber;

            if (loadTrack !== currentTrack) {

                if (currentTrack !== false) {

                    let prevTrack = playlistItem.getElementsByClassName('audio-' + currentTrack)[0];

                    if (prevTrack) {

                        prevTrack.classList.remove('playing');
                    }
                }

                audioPlayer.currentTrackNumber = loadTrack;
                audioPlayer.loadCurrentTrack();
            }

            this.classList.add('playing');

            if (audioPlayer.isPlaying()) audioPlayer.stop();

            audioPlayer.play();

            self.port.emit("state", "playing");

        } else {

            this.classList.remove('playing');
            audioPlayer.pause();

            self.port.emit("state", "pause");
        }
    }

    function removePlayingItemClass(parent, item) {

        const currentItem = parent.getElementsByClassName('audio-' + item)[0];

        if (currentItem) {

            currentItem.classList.remove('playing');
        }
    }

    function setPlayingItemClass(parent, item) {

        const currentItem = parent.getElementsByClassName('audio-' + item)[0];

        if (currentItem) {

            currentItem.classList.add('playing');
        }
    }

    function openAuthTab() {

        self.port.emit("openAuthTab");
    }


    loginButton.addEventListener("click", openAuthTab);

    audioPlayer.registerEvent('ended', () => {

        removePlayingItemClass(playlistItem, audioPlayer.currentTrackNumber);
        audioPlayer.next();

        setPlayingItemClass(playlistItem, audioPlayer.currentTrackNumber);
        audioPlayer.play();

    });

    audioPlayer.registerEvent('error', (error) => {

        const isPlaying = audioPlayer.isPlaying();

        removePlayingItemClass(playlistItem, audioPlayer.currentTrackNumber);

        audioPlayer.next();

        if (isPlaying) {

            setPlayingItemClass(playlistItem, audioPlayer.currentTrackNumber);

            audioPlayer.play();

            self.port.emit("state", "playing");

        } else {

            self.port.emit("state", "pause");
        }
    });

    self.port.on('showLogin', function() {

        playlistContent.classList.add(CSS_HIDDEN_CLASS)
        loginContent.classList.remove(CSS_HIDDEN_CLASS);
    });

    self.port.on('loadPlaylist', function(playlist) {

        if (audioPlayer.isPlaying()) return;

        loginContent.classList.add(CSS_HIDDEN_CLASS)
        playlistContent.classList.remove(CSS_HIDDEN_CLASS);

        let template = trackTemplate.innerHTML;
        let content = '';
        let i = 0;

        playlist.forEach((track) => {

            content += buildTrackTemplate(track, template, i);

            i++;

        });

        playlistItem.innerHTML = content;

        audioPlayer.playlist = playlist;

        const audio_buttons = playlistItem.getElementsByClassName('audio_play');

        for (let i in audio_buttons) {

            if (audio_buttons.hasOwnProperty(i)) {

                audio_buttons[i].addEventListener("click", playHandler);
            }
        }

    });

    self.port.on('play', function() {

        if (audioPlayer.isPlaying()) {

            audioPlayer.pause();

            removePlayingItemClass(playlistItem, audioPlayer.currentTrackNumber);

        } else {

            audioPlayer.play();

            setPlayingItemClass(playlistItem, audioPlayer.currentTrackNumber);
        }
    });

    self.port.on('next', function(isPlay) {

        removePlayingItemClass(playlistItem, audioPlayer.currentTrackNumber);

        audioPlayer.next();

        if (isPlay) {

            setPlayingItemClass(playlistItem, audioPlayer.currentTrackNumber);

            audioPlayer.play();
        }
    });

    self.port.on('prev', function(isPlay) {

        removePlayingItemClass(playlistItem, audioPlayer.currentTrackNumber);

        audioPlayer.prev();

        if (isPlay) {

            setPlayingItemClass(playlistItem, audioPlayer.currentTrackNumber);

            audioPlayer.play();
        }
    });


})(window);