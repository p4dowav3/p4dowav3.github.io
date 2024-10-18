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
    let currentVideoIndex = 0;
    const playlist = [
      { title: "Song 1", url: "dQw4w9WgXcQ" },
      { title: "Song 2", url: "9bZkp7q19f0" },
      { title: "Song 3", url: "hY7m5jjJ9mM" }
    ];

    function onYouTubeIframeAPIReady() {
      player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: playlist[currentVideoIndex].url, 
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

    function togglePlayPause() {
      const playerState = player.getPlayerState();
      if (playerState === YT.PlayerState.PLAYING) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }

    function playPrevious() {
      currentVideoIndex = (currentVideoIndex - 1 + playlist.length) % playlist.length;
      loadVideo(currentVideoIndex);
    }

    function playNext() {
      currentVideoIndex = (currentVideoIndex + 1) % playlist.length;
      loadVideo(currentVideoIndex);
    }

    function loadVideo(index) {
      player.loadVideoById(playlist[index].url);
    }

    function onPlayerStateChange(event) {
    }

    initPlaylist();
});
