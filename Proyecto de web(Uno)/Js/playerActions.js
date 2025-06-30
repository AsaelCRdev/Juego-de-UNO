import { gameState, playCard, isCardPlayable, nextTurn, drawCards, handleUnoButton } from "./gameState.js";
import { renderPlayerHand } from "./cards/renderCards.js";
//Función para agarrar cartas del "Deck", es decir, que el jugador tenga que jugar una carta porque no tiene la del "discard-zone"
document.addEventListener('click', function(e) {
    const deckArea = e.target.closest('.Deck');
    if (!deckArea) return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.isBot) return; //El bot NO puede accionar el "Deck" para agarrar una carta a través de un click

    //Agarrar una carta del "Deck"
    if (gameState.drawPile.length > 0) {
        const drawnCard = gameState.drawPile.pop();
        currentPlayer.hand.push(drawnCard);

        console.log(`Jugador ${currentPlayer.id} tomó una carta`, drawnCard); //Depurar
        renderPlayerHand(currentPlayer.id, currentPlayer.hand);
        nextTurn();
    } else {
        alert("El mazo está vacío. No puedes tomar más cartas.");
        nextTurn();
    }
});

//Listener para el botón de "UNO!"
document.addEventListener('click', function(e) {
    const unoButton = e.target.closest('.buttonUNO');
    if (!unoButton) return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.isBot) return;
    handleUnoButton(gameState.currentPlayerIndex);
});

//Card listener para jugar las cartas
export function setupCardListeners() {
    document.addEventListener('click', function(e) {
        const cardContainer = e.target.closest('.card-container');
        if (!cardContainer) return;

        const playerId = parseInt(cardContainer.dataset.playerId);
        const cardIndex = parseInt(cardContainer.dataset.cardIndex);
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];

        if (playerId !== currentPlayer.id || currentPlayer.isBot) return; //Solo dejar a los jugadores que no sean Bots

        const playedCard = {
            cardId: cardContainer.dataset.cardId,
            cardType: cardContainer.dataset.cardType,
            cardColor: cardContainer.dataset.cardColor,
            cardValue: cardContainer.dataset.cardValue
        };

        const player = gameState.players.find(p => p.id === playerId);
        const realCard = player.hand[cardIndex];

        if (!isCardPlayable(realCard)) {
            console.warn("Esta carta no puede jugarse."); //Depurar
            return;
        }

        playCard(playedCard, playerId, cardIndex);
    });
}