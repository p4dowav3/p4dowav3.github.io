document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        loadPage(href);
    }
});

function loadPage(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.querySelector('.content-wrapper').innerHTML;
            
            document.body.style.opacity = 0;
            
            setTimeout(() => {
                document.querySelector('.content-wrapper').innerHTML = newContent;
                
                history.pushState(null, '', url);
                
                document.title = doc.title;
                
                document.body.style.opacity = 1;
            }, 300);
        });
}

window.addEventListener('popstate', () => {
    loadPage(window.location.pathname);
});
