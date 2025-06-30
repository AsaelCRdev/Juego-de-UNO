export function showWinnerModal(player) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = '#fff';
    modal.style.borderRadius = '1em';
    modal.style.padding = '2em';
    modal.style.boxShadow = '0 0 20px rgba(0,0,0,0.6)';
    modal.style.zIndex = '9999';
    modal.style.textAlign = 'center';

    modal.innerHTML = `
        <h2 style="color: #d87c3a;">¡Tenemos un ganador!</h2>
        <h3>${player.name} (Jugador ${player.id}) se quedó sin cartas</h3>
        <button onclick="location.reload()" style="
            background-color: #9e0707;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 1.2rem;
            border-radius: 0.5em;
            cursor: pointer;
            margin-top: 1em;
        ">Reiniciar juego</button>
    `;
    document.body.appendChild(modal);
}