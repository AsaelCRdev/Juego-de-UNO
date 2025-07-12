// bot.js
/* 
------------------------------------------------------------------------------------------------------------------------
    Archivo .js NO FUNCIONAL para esta segunda entrega, reemplazado por la lógica dada por la profesora, Stephanie Cruz 
------------------------------------------------------------------------------------------------------------------------
*/
import { gameState, isCardPlayable, playCard, drawCards, handleUnoButton, nextTurn } from '../gameState.js';
import { renderPlayerHand } from '../cards/renderCards.js';
//Se crea una clase "Bot" para lograr crear más de un Bot
export class Bot {
    constructor(playerId) {
        this.playerId = playerId;
    }

    playTurn() {
        const player = gameState.players.find(p => p.id === this.playerId);
        if (!player) {
            console.error(`Bot: Jugador ${this.playerId} no encontrado`); //Depurar
            return;
        }

        console.log(`Bot: Turno del jugador ${player.name} (ID: ${this.playerId})`); //Depurar

        //Chequear si el Bot tiene una carta
        if (player.hand.length === 1) {
            //Llama o acciona el botón de UNO.
            handleUnoButton(gameState.currentPlayerIndex);
        }

        //Juega una carta
        const playableCardIndex = this.choosePlayableCard(player.hand);
        if (playableCardIndex !== -1) {
            const card = player.hand[playableCardIndex];
            console.log(`Bot: Jugando carta ${card.id}`); //Depurar

            //Si es una carta tipo "wild", selecciona un color
            if (card.type === 'wild' || card.type === 'drawFour') {
                card.chosenColor = this.chooseWildColor(player.hand);
                console.log(`Bot: Elige color ${card.chosenColor}`); //Depurar
            }

            //Juega la carta con una simulación de pensamiento a través del "delay"
            setTimeout(() => {
                playCard(card, this.playerId, playableCardIndex);
            }, 3000);
        } else {
            //El bot no puede jugar cartas, agarra una del "Deck"
            console.log(`Bot: No hay cartas jugables, tomando una carta`); //Depurar
            if (gameState.drawPile.length > 0) {
                drawCards(player, 1);
                const newCard = player.hand[player.hand.length - 1];
                if (isCardPlayable(newCard)) {
                    console.log(`Bot: La carta tomada ${newCard.id} es jugable`);
                    if (newCard.type === 'wild' || newCard.type === 'drawFour') {
                        newCard.chosenColor = this.chooseWildColor(player.hand);
                        console.log(`Bot: Elige color ${newCard.chosenColor}`);
                    }
                    setTimeout(() => {
                        if (player.hand.length === 2) {
                            handleUnoButton(gameState.currentPlayerIndex);
                        }
                        playCard(newCard, this.playerId, player.hand.length - 1);
                    }, 1000);
                } else {
                    console.log(`Bot: La carta tomada no es jugable, pasa turno`); //Depurar
                    setTimeout(() => nextTurn(), 3000);
                }
            } else {
                console.log(`Bot: Mazo vacío, pasa turno`); //Depurar
                setTimeout(() => nextTurn(), 3000);
            }
        }
    }

    //Lógica para que el Bot seleccione una carta que SÍ pueda jugar
    choosePlayableCard(hand) {
        let playableCards = hand
            .map((card, index) => ({ card, index }))
            .filter(({ card }) => isCardPlayable(card));

        if (playableCards.length === 0) return -1;

        let specialCard = playableCards.find(({ card }) =>
            ['drawTwo', 'reverse', 'skip', 'wild', 'drawFour'].includes(card.type)
        );
        if (specialCard) return specialCard.index;

        const topCard = gameState.discardPile[gameState.discardPile.length - 1];
        const currentColor = topCard.chosenColor || topCard.color;
        let sameColorCard = playableCards.find(({ card }) => card.color === currentColor);
        if (sameColorCard) return sameColorCard.index;

        return playableCards[0].index;
    }

    //Lógica para que el bot seleccione el color de carta que quiere cambiar en el juego 
    chooseWildColor(hand) {
        const colorCounts = { red: 0, yellow: 0, green: 0, blue: 0 };
        hand.forEach(card => {
            if (card.color !== 'wild') {
                colorCounts[card.color]++;
            }
        });

        let maxCount = 0;
        let chosenColor = 'red';
        for (const [color, count] of Object.entries(colorCounts)) {
            if (count > maxCount) {
                maxCount = count;
                chosenColor = color;
            }
        }
        return chosenColor;
    }
}