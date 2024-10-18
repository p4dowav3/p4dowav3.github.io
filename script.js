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

            document.documentElement.innerHTML = doc.documentElement.innerHTML;

            history.pushState(null, '', url);

            document.body.style.opacity = 1;
            document.body.classList.remove('fade-out');
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
