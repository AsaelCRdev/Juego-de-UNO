import { initializeDeck } from './deck.js';
import { createCardElement } from './cards/renderCards.js';
import { renderPlayerHand, highlightCurrentPlayer } from './cards/renderCards.js';
import { showWinnerModal } from './ui/ui.js';
import { Bot } from './bot/bot.js';

const gameState = {
    players: [],
    drawPile: [],
    discardPile: [],
    currentPlayerIndex: 0,
    direction: 1,
    unoButtonPressed: false,
    lastUnoCallTime: null,
    unoTimer: null,
    bots: [], //Se guardan las instancias para generar los bots
};

//Inicializar los jugadores con los datos obtenidos en index.html
function initializePlayers() {
    const username = localStorage.getItem('username') || 'Player 1';
    const numBotsRaw = localStorage.getItem('numBots');
    let numBots = parseInt(numBotsRaw) || 3;

    //Validar el numero de bots a generar
    if (isNaN(numBots) || numBots < 1 || numBots > 3) {
        console.warn(`Valor inválido para numBots: ${numBotsRaw}. Usando valor por defecto: 3`);
        numBots = 3;
    }

    console.log(`Inicializando jugadores: username=${username}, numBots=${numBots}`);

    gameState.players = [
        { id: 1, name: username, hand: [], isBot: false }
    ];

    for (let i = 1; i <= numBots; i++) {
        gameState.players.push({ id: i + 1, name: `CPU-${i}`, hand: [], isBot: true });
    }

    console.log('Jugadores inicializados:', gameState.players); //Depurar
}

//Función para iniciar el juego, inicializando los jugadores y barajando las cartas
function startGame() {
    initializePlayers();
    const fullDeck = initializeDeck(gameState.players);
    const initialCard = fullDeck[0];
    gameState.drawPile = fullDeck.slice(1);
    gameState.discardPile = [initialCard];
    console.log('Juego iniciado:', gameState); //Depurar

    //Se inicializan los bots
    gameState.bots = gameState.players
        .filter(player => player.isBot)
        .map(player => new Bot(player.id));

    checkUnoCondition(gameState.currentPlayerIndex);

    //Si el primer jugador para iniciar el juego, es un bot, realiza su turno
    if (gameState.players[gameState.currentPlayerIndex].isBot) {
        setTimeout(() => {
            gameState.bots.find(bot => bot.playerId === gameState.players[gameState.currentPlayerIndex].id).playTurn();
        }, 1000);
    }
}

//Función para obtener la ultima carta de la "discard-zone" para verificar qué cartas se pueden jugar o no.
function getTopDiscard() {
    return gameState.discardPile[gameState.discardPile.length - 1];
}

//Función para verificar si una carta es jugable a través de la función getTopDiscard()
export function isCardPlayable(card) {
    const topCard = getTopDiscard();
    if (!topCard) return true;
    const currentColor = topCard.chosenColor || topCard.color;
    const sameColor = card.color === currentColor;
    const sameValue = card.value === topCard.value;
    if (card.type === 'wild' || card.type === 'drawFour') {
        return true;
    }
    return sameColor || sameValue; //Si cumple que la carta que se va a jugar es del mismo color Ó del mismo número, se juega
}

//Función para verificar si el jugador puede pulsar el botón de "UNO"
function checkUnoCondition(playerIndex) {
    const player = gameState.players[playerIndex];
    if (!player) {
        console.error(`Jugador con índice ${playerIndex} no existe`); //Depurar
        return;
    }

    if (player.hand.length === 1 && !gameState.unoButtonPressed) {
        gameState.lastUnoCallTime = Date.now();
        console.log(`¡${player.name} tiene 1 carta! Tiene 5 segundos para presionar UNO!`); //Depurar

        gameState.unoTimer = setTimeout(() => {
            if (!gameState.unoButtonPressed) {
                console.log(`¡${player.name} no presionó UNO a tiempo! Penalización: +2 cartas`); //Depurar
                drawCards(player, 2); //Se le agregan 2 cartas por penalización
                gameState.lastUnoCallTime = null;
                applyPendingTurn(); //Aplicar el turno pendiente después de la penalización
            }
        }, 5000);
    } else if (player.hand.length !== 1) { //Lógica manejada para evitar errores al presionar "UNO" sin tener una carta
        if (gameState.unoTimer) {
            clearTimeout(gameState.unoTimer);
            gameState.unoTimer = null;
        }
        gameState.unoButtonPressed = false;
        gameState.lastUnoCallTime = null;
    }
}

//Función para manejar la acción del botón de "UNO" en el momento del juego
export function handleUnoButton(playerIndex) {
    const player = gameState.players[playerIndex];
    if (!player) { //Verificar si existe el jugador
        console.error(`Jugador con índice ${playerIndex} no existe`); //Depurar
        return;
    }

    if (player.hand.length === 1) { //Si el jugador tiene una carta, se procede a accionar el botón
        if (gameState.lastUnoCallTime && !gameState.unoButtonPressed) {
            gameState.unoButtonPressed = true;
            clearTimeout(gameState.unoTimer);
            gameState.unoTimer = null;
            console.log(`${player.name} presionó UNO a tiempo!`);
            alert(`${player.name} dijo UNO correctamente!`);
            gameState.lastUnoCallTime = null;
            applyPendingTurn(); //Aplicar el turno pendiente después de decir UNO
        } else {
            console.warn(`${player.name} ya presionó UNO o no está en tiempo de decirlo.`);
            alert("¡No puedes decir UNO ahora!");
        }
    } else {
        console.warn(`${player.name} no tiene 1 carta, no puede decir UNO.`); //Si el jugador NO tiene una carta y tiene 2 o más, se procede a mandar la alerta
        alert("¡No puedes decir UNO si no tienes exactamente 1 carta!");
    }
}

//Función para pasar de turno
export function nextTurn() {
    const { players, currentPlayerIndex, direction } = gameState;
    const totalPlayers = players.length;

    if (gameState.unoTimer) {
        clearTimeout(gameState.unoTimer);
        gameState.unoTimer = null;
    }

    gameState.currentPlayerIndex = (currentPlayerIndex + direction + totalPlayers) % totalPlayers;
    gameState.unoButtonPressed = false;
    gameState.lastUnoCallTime = null;

    //Se marca el jugador que tiene el permiso de jugar su próxima carta
    highlightCurrentPlayer();
    //Chequear la condición de cantar "UNO" antes de pasar al siguiente jugador
    checkUnoCondition(gameState.currentPlayerIndex);

    //Si el jugador actual es un BOT, acciona su turno
    const currentPlayer = players[gameState.currentPlayerIndex];
    if (currentPlayer.isBot) {
        setTimeout(() => {
            const bot = gameState.bots.find(b => b.playerId === currentPlayer.id);
            if (bot) bot.playTurn();
        }, 1000); //Pequeño "delay" para simular que el Bot piensa
    }
}

function applyPendingTurn() {
    //Aplica la acción de cambio de turno pendiente almacenada en gameState
    if (gameState.pendingTurnAction) {
        const { type, nextPlayer } = gameState.pendingTurnAction;
        switch (type) {
            case 'skip':
                console.log("Aplicando salto al siguiente jugador"); //Depurar
                nextTurn();
                nextTurn();
                break;
            case 'reverse':
                console.log("Aplicando cambio de dirección"); //Depurar
                gameState.direction *= -1;
                nextTurn();
                break;
            case 'drawTwo':
                console.log("Aplicando drawTwo al siguiente jugador"); //Depurar
                drawCards(nextPlayer, 2);
                nextTurn();
                break;
            case 'wild':
                console.log("Aplicando comodín normal"); //Depurar
                showWildColorPicker(gameState.pendingCard);
                nextTurn();
                break;
            case 'drawFour':
                console.log("Aplicando comodín +4"); //Depurar
                showWildColorPicker(gameState.pendingCard);
                drawCards(nextPlayer, 4);
                nextTurn();
                break;
            default:
                console.log("Aplicando turno normal"); //Depurar
                nextTurn();
                break;
        }
        gameState.pendingTurnAction = null;
        gameState.pendingCard = null;
    } else {
        nextTurn();
    }
}

//Función para jugar una carta
function playCard(selectedCard, playerId, cardIndex) {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    //Manejar los "id" tanto del Bot como del usuario (humano)
    const cardId = selectedCard.cardId || selectedCard.id;
    const index = cardIndex !== undefined 
        ? cardIndex 
        : player.hand.findIndex(c => c.id === cardId);

    if (index > -1) {
        const playedCard = player.hand.splice(index, 1)[0];
        gameState.discardPile.push(playedCard);

        console.log(`Se jugó la carta: ${playedCard.id}`);
        renderPlayerHand(player.id, player.hand);
        updateDiscardZone(playedCard);

        const winner = checkForWinner();
        if (winner) {
            showWinnerModal(winner);
        } else {
            const playerIndex = gameState.players.findIndex(p => p.id === playerId);
            gameState.pendingTurnAction = { type: playedCard.type, nextPlayer: getNextPlayer() };
            gameState.pendingCard = playedCard;

            if (player.hand.length === 1) {
                checkUnoCondition(playerIndex);
            } else {
                applyPendingTurn();
            }
        }
    } else {
        console.warn("Carta no encontrada en la mano del jugador", { selectedCard, playerHand: player.hand }); //Depurar
    }
}

//Función para generar y mostrar si hubo un cambio de color, a través de la carta "wild", en el juego
function showWildColorPicker(card) {
    const player = gameState.players[gameState.currentPlayerIndex];
    const discardZone = document.getElementById('discard-zone');
    if (!discardZone) return;

    //Se crea la carta
    const wildCardFront = document.createElement('div');
    wildCardFront.className = 'front-black';
    const circleWhite = document.createElement('div');
    circleWhite.className = 'black';
    const textCenter = document.createElement('div');
    textCenter.className = 'text-center';
    textCenter.textContent = card.value;
    wildCardFront.appendChild(circleWhite);
    wildCardFront.appendChild(textCenter);

    //Verificar si el jugador es un Bot
    if (player.isBot) {
        //El Bot escoge el color
        if (card.chosenColor) {
            alert(`${player.name} eligió el color ${card.chosenColor.toUpperCase()}!`);
            discardZone.innerHTML = '';
            discardZone.appendChild(wildCardFront);
            updateDiscardZone(card);
        } else {
            console.warn(`Bot ${player.name} no seleccionó un color para la carta ${card.id}`); //Depurar
            card.chosenColor = 'red'; //Color predeterminado
            alert(`${player.name} eligió el color RED (predeterminado)!`);
            discardZone.innerHTML = '';
            discardZone.appendChild(wildCardFront);
            updateDiscardZone(card);
        }
    } else {
        //Jugador humano
        const colorOptions = ['red', 'yellow', 'green', 'blue'];
        const chosenColor = prompt("Elige un color: red, yellow, green o blue");

        if (colorOptions.includes(chosenColor)) {
            card.chosenColor = chosenColor;
            discardZone.innerHTML = '';
            discardZone.appendChild(wildCardFront);
            updateDiscardZone(card);
        } else {
            alert("Color inválido");
        }
    }
}

//Función para obtener el siguiente jugador en jugar a través de su index
function getNextPlayer() {
    const { players, currentPlayerIndex, direction } = gameState;
    const nextIndex = (currentPlayerIndex + direction + players.length) % players.length;
    return players[nextIndex];
}

//Función para dibujar las cartas y rederizarlas
export function drawCards(player, count) {
    const newCards = [];
    for (let i = 0; i < count && gameState.drawPile.length > 0; i++) {
        newCards.push(gameState.drawPile.pop());
    }
    player.hand.push(...newCards);
    renderPlayerHand(player.id, player.hand);
}

/*function applyCardEffect(card) {
    // Solo registra la acción, no ejecuta nextTurn
    switch (card.type) {
        case 'skip':
            console.log("Se salta al siguiente jugador");
            return { type: 'skip' };
        case 'reverse':
            console.log("Cambia la dirección");
            return { type: 'reverse' };
        case 'drawTwo':
            console.log("El siguiente debe tomar 2 cartas");
            return { type: 'drawTwo', nextPlayer: getNextPlayer() };
        case 'wild':
            console.log("Es comodín normal");
            return { type: 'wild', card };
        case 'drawFour':
            console.log("Es comodín +4");
            return { type: 'drawFour', nextPlayer: getNextPlayer(), card };
        default:
            console.log("Carta normal");
            return { type: 'normal' };
    }
}*/

//Función para actualizar el "discard-zone", la zona de descarte de cartas jugadas al ser jugada una carta
export function updateDiscardZone(playedCard) {
    const discardZone = document.getElementById('discard-zone');
    if (!discardZone) return;

    discardZone.innerHTML = '';
    const front = document.createElement('div');
    if (playedCard.type === 'wild' || playedCard.type === 'drawFour') {
        front.className = 'front-black';
    } else {
        front.className = `front-${playedCard.color}`;
    }
    front.style.transform = 'none';
    front.style.backfaceVisibility = 'visible';
    front.style.pointerEvents = 'none';

    const colorDiv = document.createElement('div');
    if (playedCard.type === 'wild' || playedCard.type === 'drawFour') {
        colorDiv.className = 'black';
    } else {
        colorDiv.className = playedCard.color;
    }

    //Crear la carta
    const textTop = document.createElement('div');
    textTop.className = 'text-top';
    const textCenter = document.createElement('div');
    textCenter.className = 'text-center';
    const textBottom = document.createElement('div');
    textBottom.className = 'text-bottom';

    if (['drawTwo', 'reverse', 'skip', 'wild', 'drawFour'].includes(playedCard.type)) {
        const basePath = '/assets/Images/';
        if (playedCard.type === 'drawTwo') {
            textTop.innerHTML = `<img src="${basePath}plustwo-cardsymbol.png" width="50" height="50" alt="Draw Two">`;
            textCenter.innerHTML = `<img src="${basePath}drawtwocard-cardsymbol.png" width="100" height="100" alt="Draw Two">`;
            textBottom.innerHTML = `<img src="${basePath}plustwo-cardsymbol-inverted.png" width="50" height="50" alt="Draw Two">`;
        } else if (playedCard.type === 'reverse') {
            textTop.innerHTML = `<img src="${basePath}reverse-cardsymbol.png" width="50" height="50" alt="Reverse">`;
            textCenter.innerHTML = `<img src="${basePath}reverse-cardsymbol.png" width="100" height="100" alt="Reverse">`;
            textBottom.innerHTML = `<img src="${basePath}reverse-cardsymbol.png" width="50" height="50" alt="Reverse">`;
        } else if (playedCard.type === 'skip') {
            textTop.innerHTML = `<img src="${basePath}skip-cardsymbol.png" width="50" height="50" alt="Skip">`;
            textCenter.innerHTML = `<img src="${basePath}skip-cardsymbol.png" width="100" height="100" alt="Skip">`;
            textBottom.innerHTML = `<img src="${basePath}skip-cardsymbol.png" width="50" height="50" alt="Skip">`;
        } else if (playedCard.type === 'wild') {
            textTop.innerHTML = `<img src="${basePath}wild-cardsymbol.png" width="40" height="40" alt="Wild">`;
            textCenter.innerHTML = `<img src="${basePath}wild-cardsymbol.png" width="170" height="170" alt="Wild">`;
            textBottom.innerHTML = `<img src="${basePath}wild-cardsymbol.png" width="40" height="40" alt="Wild">`;
        } else if (playedCard.type === 'drawFour') {
            textTop.innerHTML = `<img src="${basePath}plusfour-cardsymbol.png" width="50" height="50" alt="Wild +4">`;
            textCenter.innerHTML = `<img src="${basePath}4cards-cardsymbol.png" width="150" height="150" alt="Wild +4">`;
            textBottom.innerHTML = `<img src="${basePath}plusfour-cardsymbol-inverted.png" width="50" height="50" alt="Wild +4">`;
        }
    } else {
        textTop.textContent = playedCard.value;
        textCenter.textContent = playedCard.value;
        textBottom.textContent = playedCard.value;
    }

    front.appendChild(colorDiv);
    front.appendChild(textTop);
    front.appendChild(textCenter);
    front.appendChild(textBottom);

    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card-container';
    cardWrapper.style.width = '150px';
    cardWrapper.style.height = '240px';
    cardWrapper.style.pointerEvents = 'none';
    cardWrapper.appendChild(front);

    discardZone.appendChild(cardWrapper);
}

//Función para chequear si hubo un ganador
export function checkForWinner() {
    for (const player of gameState.players) {
        if (player.hand.length === 0) {
            console.log(`¡Jugador ${player.id} (${player.name}) ha ganado!`); //Depurar
            return player;
        }
    }
    return null;
}

export { gameState, startGame, playCard };