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

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    initPlaylist();
});

let player;
let currentPlaylist = [];
let currentVideoIndex = 0;

const playlists = {
    playlist1: [
        { title: "ラムネイドブルーの憧憬", url: "tT1tEcvAaQM" },
        { title: "ラストスコア", url: "zAWu9BK_V5M" },
        { title: "水死体にもどらないで", url: "1bTQMYnEf_Y" },
        { title: "パインドロップ", url: "y1K8OBOU5kM" },
        { title: "少女レイ", url: "JW3N-HvU0MA" }
    ],
    playlist2: [
        { title: "ヴァンパイア", url: "e1xCOsgWG0M" },
        { title: "キュートなカノジョ", url: "oFmup8lxUHw" },
        { title: "私の恋はヘルファイア", url: "heTaHWABCOo" },
        { title: "シャンティ(SHANTI)", url: "POy0RvJeaqM" },
        { title: "BUTCHER VANITY", url: "vjBFftpQxxM" }
    ],
    playlist3: [
        { title: "人マニア", url: "HTxwOxFt5d4" },
        { title: "トラフィック・ジャム", url: "oUevY6uH4Qg" },
        { title: "㋰責任集合体", url: "c5_0NPftdlY" },
        { title: "メズマライザー", url: "19y8YTbvri8" },
        { title: "脱法ロック", url: "u5mHVUwDf_0" }
    ]
    playlist4: [
        { title: "きみとぼくのレゾナンス", url: "n4N3h4iuovs" },
        { title: "フューチャー・イヴ", url: "7j0mQH0BtEU" },
        { title: "パジャミィ", url: "aBZqxfnvaVA" },
        { title: "初音天地開闢神話", url: "8J6SMoVd5BY" },
        { title: "キラピピ★キラピカ", url: "mQH0Fmk1K0g" }
    ]
};

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: '',
        playerVars: {
            'autoplay': 0,
            'controls': 1,
            'showinfo': 0,
            'modestbranding': 1,
            'loop': 1,
            'fs': 0,
            'cc_load_policy': 0,
            'iv_load_policy': 3,
            'autohide': 0,
            'rel': 0,
            'disablekb': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    initializePlaylistButtons();
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
        html += `<li><a href="#" onclick="loadVideo(${index}); return false;">${song.title}</a></li>`;
    });
    html += '</ul>';
    playlistDisplay.innerHTML = html;
}

function loadVideo(index) {
    if (!player) return;
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

    document.getElementById("playPauseButton").addEventListener('click', togglePlayPause);
    document.getElementById("prevButton").addEventListener('click', playPrevious);
    document.getElementById("nextButton").addEventListener('click', playNext);
}

function initPlaylist() {
    // This function will be called after the page content is loaded
    if (typeof YT === 'undefined' || !YT.Player) {
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    } else {
        onYouTubeIframeAPIReady();
    }
}
