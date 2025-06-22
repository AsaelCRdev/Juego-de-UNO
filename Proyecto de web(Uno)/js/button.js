document.addEventListener('DOMContentLoaded', function() {
    const nameForm = document.getElementById('nameForm');
    if (nameForm) {
        nameForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombreInput = document.getElementById('playerName');
            if (nombreInput && nombreInput.value.trim()) {
                localStorage.setItem('nombreJugadorUno', nombreInput.value.trim());
                window.location.href = "Tablero.html";
            } else {
                alert('Por favor, ingresa tu nombre.');
            }
        });
    }

    /*Con esto se coloca el nombre del jugador en el tablero del juego */
    const player1h2 = document.querySelector('.player-1 h2');
    if (player1h2) {
        const nombre = localStorage.getItem('nombreJugadorUno');
        if (nombre) {
            player1h2.textContent = nombre;
        }
    }
});