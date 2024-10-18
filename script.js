document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
                const newContent = doc.querySelector('.content-wrapper').innerHTML;
                
                document.body.style.opacity = 0;

                setTimeout(() => {
                    document.querySelector('.content-wrapper').innerHTML = newContent;

                    const newLangMenu = doc.querySelector('.lang-menu').innerHTML;
                    document.querySelector('.lang-menu').innerHTML = newLangMenu;
                    
                    history.pushState(null, '', url);

                    document.title = doc.title;
                    
                    document.body.style.opacity = 1;
                    document.body.classList.remove('fade-out');
                }, 300);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                window.location.href = url;
            });
    }

    window.addEventListener('popstate', () => {
        loadPage(window.location.pathname);
    });
});
