import { startNewGame } from './server/api.js';
import { connectWebSocket } from './server/websocket.js';
import { renderAllPlayersHands } from './cards/renderCards.js';
import { setupCardListeners } from './playerActions.js';
import { gameState, updateDiscardZone } from './gameState.js';
//Inicializar el juego a través del DOM
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Iniciando juego...'); //Depurar
    const gameStateResponse = await startNewGame(); //Devuelve la promesa para iniciar el juego (api.js)
    console.log('Respuesta de startNewGame:', gameStateResponse); //Depurar
    
    if (gameStateResponse) {
        //Actualizar gameState con el estado inicial
        gameState.gameId = gameStateResponse.gameId;
        //Inicializar los jugadores con sus datos en un array 
        gameState.players = [
            { id: 1, name: 'Jugador 1', hand: gameStateResponse.clientCards, isBot: false },
            ...gameStateResponse.otherPlayers.map((p, i) => ({
                id: i + 2,
                name: p.name,
                hand: Array(p.count).fill({ id: 'hidden', color: 'hidden', type: 'hidden', value: 'hidden' }),
                isBot: true
            }))
        ];
        gameState.discardPile = [gameStateResponse.discardPile]; //Inicializar la zona de descarte, se pone una carta "random" en el tope de la "discard-zone"
        gameState.currentPlayerIndex = gameStateResponse.turn; //Inicializar los turnos
        gameState.direction = gameStateResponse.direction; //Inicializar la dirección del juego
        gameState.scores = gameStateResponse.scores; //Inicializar el puntaje de los jugadores
        gameState.currentColor = gameStateResponse.currentColor; //Inicializar el color actual en juego

        console.log('gameState después de inicialización:', gameState); //Depurar

        connectWebSocket(gameStateResponse.gameId); //Conexión al WebSocket
        renderAllPlayersHands(); //Renderizar las cartas de todos los jugadores
        setupCardListeners();
        updateDiscardZone(gameStateResponse.discardPile); //Actualizar la zona de descarte para empezar el juego
    } else { //Manejo de errores al iniciar el juego
        console.error('No se pudo iniciar el juego'); //Depurar
        alert('Error al iniciar el juego. Por favor, intenta de nuevo.');
    }
});