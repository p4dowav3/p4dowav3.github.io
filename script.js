let player;
let currentPlaylist = [];
let currentVideoIndex = 0;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: '',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {

}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        playNextVideo();
    }
}

function playNextVideo() {
    currentVideoIndex++;
    if (currentVideoIndex = currentPlaylist.length) {
        currentVideoIndex = 0;
    }
    player.loadVideoById(extractVideoId(currentPlaylist[currentVideoIndex].url));
}

function playPrevVideo() {
    currentVideoIndex--;
    if (currentVideoIndex < 0) {
        currentVideoIndex = currentPlaylist.length - 1;
    }
    player.loadVideoById(extractVideoId(currentPlaylist[currentVideoIndex].url));
}

function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('a').forEach(anchor = {
        anchor.addEventListener('click', function (e) {
            if (this.classList.contains('playlist-button')) {
                return;
            }
            e.preventDefault();
            
            document.body.classList.add('fade-out');
            
            let href = this.getAttribute('href');
            
            setTimeout(function () {
                loadPage(href);
            }, 1500);
        });
    });
    
    function loadPage(url) {
        fetch(url)
            .then(response = {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html = {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                document.documentElement.innerHTML = doc.documentElement.innerHTML;

                history.pushState(null, '', url);

                document.body.style.opacity = 1;
                document.body.classList.remove('fade-out');

                initPlaylist();
            })
            .catch(error = {
                console.error('Fetch error:', error);
                window.location.href = url;
            });
    }

    window.addEventListener('popstate', () = {
        loadPage(window.location.pathname);
    });

    function initPlaylist() {
        const playlistButtons = document.querySelectorAll('.playlist-button');
        const playlistDisplay = document.getElementById('playlist-display');
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        const playPauseButton = document.getElementById('playPauseButton');

        if (!playlistButtons.length || !playlistDisplay) {
            return; 
        }

        const playlists = {
            playlist1: [
                { title: "Song 1", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                { title: "Song 2", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                { title: "Song 3", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
            ],
            playlist2: [
                { title: "Song A", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                { title: "Song B", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                { title: "Song C", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
            ],
            playlist3: [
                { title: "Song X", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                { title: "Song Y", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                { title: "Song Z", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
            ]
        };

        playlistButtons.forEach(button = {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const playlistName = this.getAttribute('data-playlist');
                currentPlaylist = playlists[playlistName];
                displayPlaylist(currentPlaylist);
                currentVideoIndex = 0;
                player.loadVideoById(extractVideoId(currentPlaylist[0].url));
            });
        });

        function displayPlaylist(playlist) {
            let html = '<ul>';
            playlist.forEach((song, index) = {
                html += `<li><a href="#" onclick="player.loadVideoById('${extractVideoId(song.url)}'); currentVideoIndex = ${index}; return false;">${song.title}</a></li>`;
            });
            html += '</ul>';
            playlistDisplay.innerHTML = html;
        }

        prevButton.addEventListener('click', playPrevVideo);
        nextButton.addEventListener('click', playNextVideo);
        playPauseButton.addEventListener('click', () = {
            if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
        });
    }

    initPlaylist();
});
