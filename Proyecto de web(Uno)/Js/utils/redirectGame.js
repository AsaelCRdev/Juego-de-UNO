document.getElementById('playButton').addEventListener('click', function(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('usernameInput').value.trim();
    if (!usernameInput) {
    alert('Por favor, introduce un nombre de usuario.');
    return;
    }
    
    const selectedBot = document.querySelector('input[name="radio"]:checked');
    if (!selectedBot) {
    alert('Por favor, selecciona un número de bots.');
    return;
    }
    
    const numBots = parseInt(selectedBot.value);
    if (isNaN(numBots) || numBots < 1 || numBots > 3) {
    alert('Número de bots inválido. Selecciona 1, 2 o 3 bots.');
    return;
    }
    
    // Store data in localStorage
    localStorage.setItem('username', usernameInput);
    localStorage.setItem('numBots', numBots.toString());
    
    // Redirect to game page
    window.location.href = '/Vista/Paginas/tablero.html';
});