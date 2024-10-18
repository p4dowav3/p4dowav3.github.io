document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('a').forEach(anchor => {
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
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                document.documentElement.innerHTML = doc.documentElement.innerHTML;

                history.pushState(null, '', url);

                document.body.style.opacity = 1;
                document.body.classList.remove('fade-out');

                initPlaylist();
            })
            .catch(error => {
                console.error('Fetch error:', error);
                window.location.href = url;
            });
    }

    window.addEventListener('popstate', () => {
        loadPage(window.location.pathname);
    });

let player;
let currentPlaylist = [];
let currentVideoIndex = 0;

const playlists = {
    playlist1: [
        { title: "Song 1", url: "dQw4w9WgXcQ" },
        { title: "Song 2", url: "9bZkp7q19f0" },
        { title: "Song 3", url: "hY7m5jjJ9mM" }
    ],
    playlist2: [
        { title: "Song A", url: "z9Uz1icjwrM" },
        { title: "Song B", url: "C0DPdy98e4c" },
        { title: "Song C", url: "wZZ7oFKsKzY" }
    ],
    playlist3: [
        { title: "Track X", url: "5NV6Rdv1a3I" },
        { title: "Track Y", url: "pXRviuL6vMY" },
        { title: "Track Z", url: "Kp7eSUU9oy8" }
    ]
};

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
    document.getElementById("playPauseButton").addEventListener('click', togglePlayPause);
    document.getElementById("prevButton").addEventListener('click', playPrevious);
    document.getElementById("nextButton").addEventListener('click', playNext);
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        playNext();
    }
}

function loadPlaylist(playlistName) {
    if (!player) {
        console.error('YouTube player is not ready yet.');
        return;
    }
    currentPlaylist = playlists[playlistName];
    currentVideoIndex = 0;
    displayPlaylist(currentPlaylist);
    if (currentPlaylist.length > 0) {
        loadVideo(currentVideoIndex);
    }
}

function displayPlaylist(playlist) {
    const playlistDisplay = document.getElementById('playlist-display');
    let html = '<ul>';
    playlist.forEach((song, index) => {
        html += `<li><a href="#" onclick="loadVideo(${index})">${song.title}</a></li>`;
    });
    html += '</ul>';
    playlistDisplay.innerHTML = html;
}

function loadVideo(index) {
    if (!player) {
        console.error('YouTube player is not ready yet.');
        return;
    }
    currentVideoIndex = index;
    player.loadVideoById(currentPlaylist[currentVideoIndex].url);
}

function togglePlayPause() {
    if (!player) return;
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

function playPrevious() {
    if (!player) return;
    currentVideoIndex = (currentVideoIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    loadVideo(currentVideoIndex);
}

function playNext() {
    if (!player) return;
    currentVideoIndex = (currentVideoIndex + 1) % currentPlaylist.length;
    loadVideo(currentVideoIndex);
}

function initializePlaylistButtons() {
    document.querySelectorAll('.playlist-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const playlistName = this.getAttribute('data-playlist');
            loadPlaylist(playlistName);
        });
    });
}

// Check if YouTube IFrame API is loaded
function checkYouTubeApiLoaded() {
    if (typeof YT !== 'undefined' && YT.Player) {
        onYouTubeIframeAPIReady();
    } else {
        setTimeout(checkYouTubeApiLoaded, 100);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    initializePlaylistButtons();
    checkYouTubeApiLoaded();
});
