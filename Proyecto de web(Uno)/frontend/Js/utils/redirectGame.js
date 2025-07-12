document.getElementById('playButton').addEventListener('click', function(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('usernameInput').value.trim();
    if (!usernameInput) {
        alert('Por favor, introduce un nombre de usuario.');
        return;
    }
    
    // Eliminado para esta entrega
    /*const selectedBot = document.querySelector('input[name="radio"]:checked');
    if (!selectedBot) {
    alert('Por favor, selecciona un número de bots.');
    return;
    }*/
    
    // Eliminado para esta entrega
    /*const numBots = parseInt(selectedBot.value);
    if (isNaN(numBots) || numBots < 1 || numBots > 3) {
    alert('Número de bots inválido. Selecciona 1, 2 o 3 bots.');
    return;
    }*/

    const numBots = 3; //Se juegan siempre 3 bots, incorporado para esta entrega
    
    localStorage.setItem('username', usernameInput);
    localStorage.setItem('numBots', numBots.toString());
    
    //Redirigir al tablero para jugar
    window.location.href = '/Proyecto de web(Uno)/frontend/Vista/Paginas/tablero.html';
});