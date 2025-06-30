//main.js del Juego
import { gameState, startGame, updateDiscardZone } from './gameState.js';
import { renderAllPlayersHands } from './cards/renderCards.js';
import { setupCardListeners } from './playerActions.js';

//Inicializar el DOM cuando ya esté listo
document.addEventListener('DOMContentLoaded', () => {
    //gameState.players[0].name = 'Chapi'; //Depurar
    //gameState.players[1].name = 'CPU'; //Depurar

    startGame(); //Iniciar el juego
    renderAllPlayersHands(); //Renderizar las cartas de los jugadores
    setupCardListeners();

    if (gameState.discardPile.length > 0) {
        const initialCard = gameState.discardPile[0];
        updateDiscardZone(initialCard);
    }
});