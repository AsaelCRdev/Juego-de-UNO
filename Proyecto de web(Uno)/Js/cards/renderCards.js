import { drawCards, gameState } from '../gameState.js';

export function createCardElement(card) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';
    cardContainer.dataset.cardId = card.id;
    cardContainer.dataset.cardType = card.type;
    cardContainer.dataset.cardColor = card.color;
    cardContainer.dataset.cardValue = card.value;

    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    //BACK (parte trasera) (Círculo con UNO)
    const back = document.createElement('div');
    back.className = 'back';

    const circleBack = document.createElement('div');
    circleBack.className = 'red'; //Círculo blanco siempre

    const textUNO = document.createElement('div');
    textUNO.className = 'text';
    textUNO.textContent = 'UNO';

    back.appendChild(circleBack);
    back.appendChild(textUNO);

    //FRONT (frente) (Números, colores...)
    let frontColor = card.color;

    //Si es wild o drawFour
    if (card.value === 'wild' || card.value === 'drawFour') {
        frontColor = 'black';
    }

    const front = document.createElement('div');
    front.className = `front-${frontColor}`;

    const colorDiv = document.createElement('div');
    colorDiv.className = frontColor;

    const textTop = document.createElement('div');
    textTop.className = 'text-top';

    const textCenter = document.createElement('div');
    textCenter.className = 'text-center';

    const textBottom = document.createElement('div');
    textBottom.className = 'text-bottom';

    //Mostrar imágenes según el tipo de carta (más que todo para las Wild)
    if (card.value === 'drawTwo') {
        textTop.innerHTML = `<img src="/assets/Images/plustwo-cardsymbol.png" width="50" height="50" alt="je">`;
        textCenter.innerHTML = `<img src="/assets/Images/drawtwocard-cardsymbol.png" width="100" height="100" alt="Draw Two">`;
        textBottom.innerHTML = `<img src="/assets/Images/plustwo-cardsymbol-inverted.png" width="50" height="50" alt="Draw Two">`;
    } else if (card.value === 'reverse') {
        textTop.innerHTML = `<img src="/assets/Images/reverse-cardsymbol.png" width="50" height="50" alt="Reverse">`;
        textCenter.innerHTML = `<img src="/assets/Images/reverse-cardsymbol.png" width="100" height="100" alt="Reverse">`;
        textBottom.innerHTML = `<img src="/assets/Images/reverse-cardsymbol.png" width="50" height="50" alt="Reverse">`;
    } else if (card.value === 'skip') {
        textTop.innerHTML = `<img src="/assets/Images/skip-cardsymbol.png" width="50" height="50" alt="Skip">`;
        textCenter.innerHTML = `<img src="/assets/Images/skip-cardsymbol.png" width="100" height="100" alt="Skip">`;
        textBottom.innerHTML = `<img src="/assets/Images/skip-cardsymbol.png" width="50" height="50" alt="Skip">`;
    } else if (card.value === 'wild') {
        textTop.innerHTML = `<img src="/assets/Images/wild-cardsymbol.png" width="40" height="40" alt="Wild">`;
        textCenter.innerHTML = `<img src="/assets/Images/wild-cardsymbol.png" width="170" height="170" alt="Wild">`;
        textBottom.innerHTML = `<img src="/assets/Images/wild-cardsymbol.png" width="40" height="40" alt="Wild">`;
    } else if (card.value === 'drawFour') {
        textTop.innerHTML = `<img src="/assets/Images/plusfour-cardsymbol.png" width="50" height="50" alt="Wild +4">`;
        textCenter.innerHTML = `<img src="/assets/Images/4cards-cardsymbol.png" width="150" height="150" alt="Wild +4">`;
        textBottom.innerHTML = `<img src="/assets/Images/plusfour-cardsymbol-inverted.png" width="50" height="50" alt="Wild +4">`;
    } else {
        //Para cartas normales (números)
        textTop.textContent = card.value;
        textCenter.textContent = card.value;
        textBottom.textContent = card.value;
    }

    //Construir la carta completa
    front.appendChild(colorDiv);
    front.appendChild(textTop);
    front.appendChild(textCenter);
    front.appendChild(textBottom);

    cardDiv.appendChild(back);
    cardDiv.appendChild(front);
    cardContainer.appendChild(cardDiv);

    return cardContainer;
}

export function renderPlayerHand(playerId, hand) {
    const container = document.querySelector(`.player-${playerId} .cards-wrapper`);
    if (!container) return;

    //Limpiar antes de repartir
    container.innerHTML = '';

    //Revisa si el jugador es un Bot
    const player = gameState.players.find(p => p.id === playerId);
    const isBot = player ? player.isBot : false;

    hand.forEach((card, index) => {
        const cardElement = createCardElement(card);

        //Se le añade el estilo correspondiente al Bot para que no se vean sus cartas al hacer "hover"
        if (isBot) {
            cardElement.classList.add('bot-card');
        }

        //Aplicar clase de animación
        cardElement.classList.add('card-fly');
        cardElement.dataset.playerId = playerId;
        cardElement.dataset.cardIndex = index;

        //Insertar con retraso para crear efecto de reparto
        setTimeout(() => {
            container.appendChild(cardElement);
        }, index * 200); //150ms entre carta y carta
    });
}

//Función para "remarcar" o "resaltar" el jugador que puede jugar la carta
export function highlightCurrentPlayer() {
    const { players, currentPlayerIndex } = gameState;

    players.forEach((player, index) => {
        const playerArea = document.querySelector(`.player-${player.id}`);
        if (!playerArea) return;

        // Quitar clases previas
        const nameElement = playerArea.querySelector('.highlight-name');
        if (!nameElement) return;

        if (index === currentPlayerIndex) {
            nameElement.classList.add('current-player');
        } else {
            nameElement.classList.remove('current-player');
        }
    });
}

//Renderizar las cartas de todos los jugadores
export function renderAllPlayersHands() {
    gameState.players.forEach(player => {
        renderPlayerHand(player.id, player.hand);
    });
}