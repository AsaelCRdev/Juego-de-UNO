document.addEventListener('DOMContentLoaded', function() {
    const exitButton = document.getElementById('exit')
    if (exitButton) {
        exitButton.addEventListener('click', function() {
            window.location.href = "index.html";
        });
    } 
});