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

    function initPlaylist() {
        const playlistButtons = document.querySelectorAll('.playlist-button');
        const playlistDisplay = document.getElementById('playlist-display');

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

        playlistButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const playlistName = this.getAttribute('data-playlist');
                displayPlaylist(playlists[playlistName]);
            });
        });

        function displayPlaylist(playlist) {
            let html = '<ul>';
            playlist.forEach(song => {
                html += `<li><a href="${song.url}" target="_blank">${song.title}</a></li>`;
            });
            html += '</ul>';
            playlistDisplay.innerHTML = html;
        }
    }

    initPlaylist();
});
