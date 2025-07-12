//Cargar el nombre del jugador y el número de bots utilizando localStorage
//Archivo .js de la entrega vieja
document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username') || 'Usuario';
    const numBots = parseInt(localStorage.getItem('numBots')) || 3
    //Actualizar el nombre del jugador 1
    document.getElementById('player-1-name').textContent = username
    //Ocultar bots extras
    if (numBots < 3) {
        document.getElementById('player-4').style.display = 'none';
    }
    if (numBots < 2) {
        document.getElementById('player-3').style.display = 'none';
    }
});