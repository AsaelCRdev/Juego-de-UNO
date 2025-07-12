import { gameState, updateDiscardZone, showWildColorPicker } from '../gameState.js';
import { renderAllPlayersHands, highlightCurrentPlayer } from '../cards/renderCards.js';
import { showWinnerModal } from '../ui/ui.js';
let socket;
let gameId; //Variable para almacenar el gameId

export function connectWebSocket(gId) {
    //Cerrar WebSocket existente si está abierto
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
    }

    gameId = gId;
    socket = new WebSocket('ws://localhost:3001'); //Conexión al WebSocket otorgado

    socket.onopen = () => {
        console.log('WebSocket connected'); //Conexión exitosa con el WebSocket
        socket.send(JSON.stringify({ type: 'subscribe', gameId }));
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message:', JSON.stringify(data, null, 2)); //Depurar gracias a mensaje de WebSocket
        handleServerUpdate(data); //Actualizar el servidor
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error); //Depurar gracias a mensaje de WebSocket
        showNotification('Error de conexión. Intentando reconectar...');
    };

    socket.onclose = () => {
        console.log('WebSocket disconnected'); //Depurar gracias a mensaje de WebSocket
        setTimeout(() => connectWebSocket(gameId), 1000);
    };
}

//Función para manejar las actualizaciones del servidor (server.js) para manejar las nuevas lógicas del juego incorporadas desde el backend
function handleServerUpdate(data) {
    console.log('Manejando actualización del servidor:', JSON.stringify(data, null, 2)); //Depurar
    switch (data.type) {
        case 'subscribed':
            console.log(`Suscrito al juego con id: ${data.gameId}`); //Depurar
            updateTurnIndicator(); //Actualizar los turnos
            break;
        case 'client_play':
        case 'bot_play':
            console.log(`Evento ${data.type}:`, JSON.stringify(data, null, 2)); //Depurar
            let message = `${data.player} jugó ${data.card.value}`;
            if (data.card.value === 'wild' || data.card.value === 'wild4') {
                message += ` y eligió ${data.gameState.currentColor}`; //Mostrar en la notificación el color escogido de carta por el "wild" o "wild4"
            }
            showNotification(message); //Mostrar notificación de movimiento de jugador
            updateGameState(data.gameState);
            updateDiscardZone(data.gameState.discardPile);
            highlightCurrentPlayer(); //Actualizar el próximo turno del jugador (bot)
            updateTurnIndicator(); //Actualizar los turnos
            renderAllPlayersHands(); //Renderizar después de la actualización del estado
            break;
        case 'client_uno':
        case 'bot_uno':
            showNotification(`${data.player} dijo UNO!`);
            updateGameState(data.gameState); //Actualizar el estado del juego
            break;
        case 'uno_warning':
            showNotification('¡Te queda una carta! Di UNO en 4 segundos!');
            updateGameState(data.gameState); //Actualizar el estado del juego
            updateUnoButton();
            break;
        case 'uno_penalty':
            showNotification(`${data.player} no dijo UNO. Robó ${data.amount} cartas`);
            updateGameState(data.gameState); //Actualizar el estado del juego
            renderAllPlayersHands();
            break;
        case 'client_draw_from_deck':
        case 'bot_draw_from_deck':
            showNotification(`${data.player} robó una carta`);
            updateGameState(data.gameState); //Actualizar el estado del juego
            renderAllPlayersHands();
            break;
        case 'draw_penalty':
            showNotification(`Jugador ${data.affectedPlayer + 1} robó ${data.amount} cartas`);
            updateGameState(data.gameState); //Actualizar el estado del juego
            renderAllPlayersHands();
            break;
        case 'round_score':
            showWinnerModal({
                name: data.winner,
                id: data.winnerIdx + 1,
                gameId: data.gameState.gameId
            });
            updateGameState(data.gameState); //Actualizar el estado del juego
            updateScoreboard(data.scores);
            break;
        default:
            console.warn('Evento desconocido:', data.type); //Depurar
    }
}

//Actualización del estado de juego
function updateGameState(serverState) {
    console.log('Actualizando gameState:', JSON.stringify(serverState, null, 2)); //Depurar
    
    //Actualizar propiedades básicas
    gameState.gameId = serverState.gameId;
    gameState.finished = serverState.finished;
    gameState.discardPile = [serverState.discardPile];
    gameState.currentPlayerIndex = serverState.turn;
    gameState.direction = serverState.direction;
    gameState.scores = serverState.scores;
    gameState.currentColor = serverState.currentColor;
    
    //Actualizar jugadores
    if (!gameState.players || gameState.players.length === 0) {
        //Primera inicialización de jugador
        gameState.players = [
            { id: 1, name: 'Jugador 1', hand: serverState.clientCards || [], isBot: false },
            ...serverState.otherPlayers.map((p, i) => ({
                id: i + 2,
                name: p.name,
                hand: Array(p.count).fill({ id: `hidden-${i}-${Date.now()}`, color: 'hidden', type: 'hidden', value: 'hidden' }),
                isBot: true
            }))
        ];
    } else {
        //Actualización existente - SÓLO actualizar las manos o "hands" del jugador
        gameState.players[0].hand = serverState.clientCards || [];
        
        //Para los bots, crear nuevas cartas hidden (para que no se puedan ver ni hacer hover) solo si el número cambió
        //Se crea esta nueva modalidad de "hidden" para evitar los máximos errores posibles en los "hovers" de las cartas y visualización de movimientos por consola de los jugadores. 
        serverState.otherPlayers.forEach((p, i) => {
            const botIndex = i + 1;
            if (gameState.players[botIndex] && gameState.players[botIndex].hand.length !== p.count) {
                gameState.players[botIndex].hand = Array(p.count).fill(null).map((_, cardIndex) => ({
                    id: `hidden-${botIndex}-${cardIndex}-${Date.now()}`,
                    color: 'hidden',
                    type: 'hidden',
                    value: 'hidden'
                }));
            }
        });
    }
    
    console.log('gameState después de actualización:', JSON.stringify(gameState, null, 2)); //Depurar
}

//Función para actualizar la "scoreboard" o el marcador de puntajes de los jugadores
export function updateScoreboard(scores) {
    console.log('Actualizando marcador:', scores);
    const scoreboard = document.querySelector('.scoreboard');
    if (scoreboard && gameState.players) {
        scoreboard.innerHTML = `
            <h2 style="color: #d87c3a; margin-bottom: 1em;">Marcador</h2>
            ${gameState.players.map(p => `<div>${p.name}: ${scores[p.id - 1] || 0}</div>`).join('')}
        `;
    }
}

//Función que nos ayuda a verificar (además del "highlightPlayer" existente) a saber cuál es el próximo jugador a mover una carta
export function updateTurnIndicator() {
    console.log('Actualizando indicador de turno:', gameState.currentPlayerIndex); //Depurar
    const turnIndicator = document.querySelector('.turn-indicator');
    if (turnIndicator && gameState.players) {
        turnIndicator.textContent = `Turno: ${gameState.players[gameState.currentPlayerIndex].name}`;
    }
}

//Función para actualizar el estado del botón de UNO.
function updateUnoButton() {
    console.log('Actualizando botón UNO'); //Depurar
    const button = document.querySelector('.buttonUNO');
    if (!button) {
        console.error('Botón UNO no encontrado'); //Depurar
        return;
    }
    button.disabled = gameState.players[0].hand.length !== 1 || gameState.currentPlayerIndex !== 0;
}

//Función para mostrar las notificaciones de movimientos de cartas de los jugadores
function showNotification(message) {
    console.log('Mostrando notificación:', message); //Depurar
    const notifications = document.querySelector('.notifications');
    if (!notifications) {
        console.error('Contenedor de notificaciones no encontrado'); //Depurar
        return;
    }
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.classList.add('notification');
    notifications.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}