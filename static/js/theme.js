if(localStorage.getItem('theme') === null) {
    localStorage.setItem('theme', 'dark');

    document.body.setAttribute('data-bs-theme', 'dark');
} else {
    document.body.setAttribute('data-bs-theme', localStorage.getItem('theme'));
}

function changeTheme() {

    var atual = localStorage.getItem('theme');

    if(atual === 'dark') {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
    
    document.body.setAttribute('data-bs-theme', localStorage.getItem('theme'));
}