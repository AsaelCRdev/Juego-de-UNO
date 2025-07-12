import { startNewGame, startNewRound } from '../server/api.js';
import { connectWebSocket, updateScoreboard, updateTurnIndicator } from '../server/websocket.js';
import { renderAllPlayersHands, highlightCurrentPlayer } from '../cards/renderCards.js';
import { updateDiscardZone, gameState } from '../gameState.js';

//Mostrar el modal del finalización de partida y el ganador correspondiente
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
        <button class="new-round-button" style="
            background-color: #4caf50;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 1.2rem;
            border-radius: 0.5em;
            cursor: pointer;
            margin: 0.5em;
        ">New Round</button>
        <button class="restart-button" style="
            background-color: #9e0707;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 1.2rem;
            border-radius: 0.5em;
            cursor: pointer;
            margin: 0.5em;
        ">Restart Game</button>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.new-round-button').addEventListener('click', async () => { //Nueva ronda, los jugadores mantienen sus puntajes para la próxima ronda
        const gameStateResponse = await startNewRound(player.gameId); //Se inicia la promesa para iniciar una ronda nueva manteninedo los puntajes existentes
        if (gameStateResponse) {
            //Actualizar el gameState
            gameState.gameId = gameStateResponse.gameId;
            gameState.players = [
                { id: 1, name: 'Jugador 1', hand: gameStateResponse.clientCards, isBot: false },
                ...gameStateResponse.otherPlayers.map((p, i) => ({
                    id: i + 2,
                    name: p.name,
                    hand: Array(p.count).fill({ id: 'hidden', color: 'hidden', type: 'hidden', value: 'hidden' }),
                    isBot: true
                }))
            ];
            gameState.discardPile = [gameStateResponse.discardPile];
            gameState.currentPlayerIndex = gameStateResponse.turn;
            gameState.direction = gameStateResponse.direction;
            gameState.scores = gameStateResponse.scores;
            gameState.currentColor = gameStateResponse.currentColor;
            gameState.finished = gameStateResponse.finished;

            //Actualizar la UI
            renderAllPlayersHands(); //Renderizar las cartas de todos los jugadores
            updateDiscardZone(gameStateResponse.discardPile); //Se actualiza la "discard-zone"; se vuelve a colocar una carta "random" a la "discard-zone" para empezar el juego
            highlightCurrentPlayer(); //Se destaca el jugador a mover la carta
            updateTurnIndicator(); //Se actualiza el turno del jugador que va a jugar la carta
            updateScoreboard(gameStateResponse.scores); //Se actualiza la "scoreboard" o marcador con los puntajes de la partida anterior para seguir con la nueva ronda
            modal.remove(); //Cerrar el modal
        } else { //Manejo de errores
            console.error('Error al iniciar nueva ronda'); //Depurar
            alert('No se pudo iniciar la nueva ronda. Por favor, intenta de nuevo.');
        }
    });

    modal.querySelector('.restart-button').addEventListener('click', async () => { //Nueva partida (se borran los puntajes de los jugadores de la partida anterior)
        const gameStateResponse = await startNewGame();
        if (gameStateResponse) {
            //Actualizar gameState
            gameState.gameId = gameStateResponse.gameId;
            gameState.players = [
                { id: 1, name: 'Jugador 1', hand: gameStateResponse.clientCards, isBot: false },
                ...gameStateResponse.otherPlayers.map((p, i) => ({
                    id: i + 2,
                    name: p.name,
                    hand: Array(p.count).fill({ id: 'hidden', color: 'hidden', type: 'hidden', value: 'hidden' }),
                    isBot: true
                }))
            ];
            gameState.discardPile = [gameStateResponse.discardPile]; 
            gameState.currentPlayerIndex = gameStateResponse.turn;
            gameState.direction = gameStateResponse.direction;
            gameState.scores = gameStateResponse.scores;
            gameState.currentColor = gameStateResponse.currentColor;
            gameState.finished = gameStateResponse.finished;

            // Reconectar WebSocket
            connectWebSocket(gameStateResponse.gameId); //Conexión al WebSocket
            // Actualizar la UI
            renderAllPlayersHands(); //Renderizar las cartas de todos los jugadores
            updateDiscardZone(gameStateResponse.discardPile); //Se actualiza la "discard-zone"; se vuelve a colocar una carta "random" a la "discard-zone" para empezar el juego
            highlightCurrentPlayer(); //Se destaca el jugador a mover la carta
            updateTurnIndicator(); //Se actualiza el turno del jugador que va a jugar la carta
            updateScoreboard(gameStateResponse.scores); //Se actualiza la "scoreboard" o marcador con los puntajes de la partida anterior para seguir con la nueva ronda
            modal.remove(); //Cerrar el modal
        } else {
            console.error('Error al reiniciar el juego'); //Depurar
            alert('No se pudo reiniciar el juego. Por favor, intenta de nuevo.');
        }
    });
}