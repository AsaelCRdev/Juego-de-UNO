import { initializeDeck } from './deck.js';

const gameState = {
    players: [
        { id: 1, name: 'Player 1', hand: [] },
        { id: 4, name: 'CPU 1', hand: [] },
        // Puedes agregar más jugadores si lo deseas
    ],
    drawPile: [],
    discardPile: [],
    currentPlayerIndex: 0,
    direction: 1, // 1 = sentido horario, -1 = antihorario
};

function startGame() {
    // Inicializar mazo y repartir cartas
    gameState.drawPile = initializeDeck(gameState.players);

    // Colocar primera carta en la pila de descarte
    if (gameState.drawPile.length > 0) {
        const firstCard = gameState.drawPile.pop();
        gameState.discardPile.push(firstCard);
    }

    console.log('Juego iniciado:', gameState);
}

export { gameState, startGame };