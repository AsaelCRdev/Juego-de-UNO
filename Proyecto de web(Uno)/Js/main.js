import { startGame } from './gameState.js';
import { renderAllPlayersHands } from './cards/renderCards.js';

document.addEventListener('DOMContentLoaded', () => {
    startGame(); // Iniciar juego
    renderAllPlayersHands(); // Mostrar cartas en pantalla
});