import { gameState, showWildColorPicker } from './gameState.js';
import { playCard, drawCard, callUno } from './server/api.js';

export function setupCardListeners() {
    document.addEventListener('click', async function(e) {
        const cardContainer = e.target.closest('.card-container');
        if (!cardContainer) return;

        //Obtener el playerId y el índice de carta
        const playerId = parseInt(cardContainer.dataset.playerId);
        const cardIndex = parseInt(cardContainer.dataset.cardIndex);
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];

        if (playerId !== currentPlayer.id || currentPlayer.isBot || gameState.currentPlayerIndex !== 0) return;

        const card = currentPlayer.hand[cardIndex];
        if (!card) {
            console.warn('Carta no encontrada en el index:', cardIndex); //Depurar
            return;
        }

        //Obtener la posición de la "discard-zone" para realizar la animación de juego de carta
        const discardZone = document.getElementById('discard-zone');
        if (!discardZone) {
            console.error('No se encontró la zona de descarte'); //Depurar
            return;
        }

        const cardRect = cardContainer.getBoundingClientRect();
        const discardRect = discardZone.getBoundingClientRect();

        // Calcular la traslación de la carta
        const deltaX = discardRect.left - cardRect.left + (discardRect.width - cardRect.width) / 2;
        const deltaY = discardRect.top - cardRect.top + (discardRect.height - cardRect.height) / 2;

        //No habilitar "clicks" múltiples
        cardContainer.style.pointerEvents = 'none';

        //Se aplica la animación -> levanta la carta hasta los 50px y lo mueve a la "discard-zone"
        cardContainer.classList.add('card-fly-to-discard');
        cardContainer.style.transform = `translateY(-50px)`; //Se aplica el estilo

        //Espera a la animacion para levantar la carta (el timeout) y procede a moverlo al "discard-zone"
        setTimeout(() => {
            cardContainer.style.transform = `translate(${deltaX}px, ${deltaY}px)`; //Se aplica el estilo
        }, 300);

        setTimeout(async () => {
            if (card.type === 'wild' || card.type === 'wild4') { //Verifica si se esta jugando una carta Wild, la logica es: primero la animacion -> una pausa -> se selecciona el color -> termina de colocarse la carta en la zona de descarte
                await showWildColorPicker(card);
            } else {
                const response = await playCard(gameState.gameId, card);
                if (response) {
                    //Actualizar la "discard-zone" despues de la animacion de juego de carta y la WebSocket se encarga de las actualizaciones del juego
                    updateDiscardZone(card);
                    //Eliminar la carta del DOM
                    cardContainer.remove();
                } else {
                    //Si la animacion falla, revertir el juego de carta
                    cardContainer.style.transform = '';
                    cardContainer.classList.remove('card-fly-to-discard');
                    cardContainer.style.pointerEvents = 'auto';
                }
            }
        }, 800);
    });

    //Listener para el boton de UNO!
    document.addEventListener('click', async function(e) {
        const unoButton = e.target.closest('.buttonUNO');
        if (!unoButton) return;

        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        if (currentPlayer.isBot || gameState.currentPlayerIndex !== 0) return;

        const response = await callUno(gameState.gameId);
        if (response) {
            //Las actualizaciones de la "UI" se encarga el WebSocket
        }
    });

    //Listener para robar la carta
    document.addEventListener('click', async function(e) {
        const deckArea = e.target.closest('.Deck');
        if (!deckArea) return;

        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        if (currentPlayer.isBot || gameState.currentPlayerIndex !== 0) return;

        const response = await drawCard(gameState.gameId);
        if (response) {
            //Las actualizaciones de la "UI" se encarga el WebSocket
        }
    });
}