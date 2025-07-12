import { drawCards, gameState } from '../gameState.js';

//Crear la carta
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

    //Solo añadir texto "UNO" si la carta no es hidden
    
    back.appendChild(circleBack);
    back.appendChild(textUNO);

    //FRONT (frente) (Números, colores...)
    let frontColor = card.color;

    //Si es wild o drawFour
    if (card.value === 'wild' || card.value === 'wild4') {
        frontColor = 'black';
    } else if (card.color === 'hidden') {
        frontColor = 'red'; //Usamos rojo para el frente de cartas hidden, pero no se mostrará
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

    //Añadir clase hidden-card (que no se puedan ver las cartas de los demás jugadores) y omitir contenido para cartas hidden
    if (card.color === 'hidden') {
        cardDiv.classList.add('hidden-card');
        textTop.textContent = '';
        textCenter.textContent = '';
        textBottom.textContent = '';
    } else { //Dibujar las cartas del jugador
        //Mostrar imágenes según el tipo de carta (más que todo para las Wild)
        if (card.value === 'draw2') {
            textTop.innerHTML = `<img src="/Proyecto de web(Uno)/frontend/assets/Images/plustwo-cardsymbol.png" width="50" height="50" alt="Draw Two">`;
            textCenter.innerHTML = `<img src="/Proyecto de web(Uno)/frontend/assets/Images/drawtwocard-cardsymbol.png" width="100" height="100" alt="Draw Two">`;
            textBottom.innerHTML = `<img src="/Proyecto de web(Uno)/frontend/assets/Images/plustwo-cardsymbol-inverted.png" width="50" height="50" alt="Draw Two">`;
        } else if (card.value === 'reverse') {
            textTop.innerHTML = `<img src="/Proyecto de web(Uno)/frontend/assets/Images/reverse-cardsymbol.png" width="50" height="50" alt="Reverse">`;
            textCenter.innerHTML = `<img src="/Proyecto de web(Uno)/frontend/assets/Images/reverse-cardsymbol.png" width="100" height="100" alt="Reverse">`;
            textBottom.innerHTML = `<img src="/Proyecto de web(Uno)/frontend/assets/Images/reverse-cardsymbol.png" width="50" height="50" alt="Reverse">`;
        } else if (card.value === 'skip') {
            textTop.innerHTML = `<img src="/Proyecto de web(Uno)/frontend/assets/Images/skip-cardsymbol.png" width="50" height="50" alt="Skip">`;
            textCenter.innerHTML = `<img src="/Proyecto de web(Uno)/frontend/assets/Images/skip-cardsymbol.png" width="100" height="100" alt="Skip">`;
            textBottom.innerHTML = `<img src="/Proyecto de web(Uno)/frontend/assets/Images/skip-cardsymbol.png" width="50" height="50" alt="Skip">`;
        } else if (card.value === 'wild') {
            textTop.innerHTML = `<img src="/Proyecto de web(Uno)/frontend/assets/Images/wild-cardsymbol.png" width="40" height="40" alt="Wild">`;
            textCenter.innerHTML = `<img src="/Proyecto de web(Uno)/frontend/assets/Images/wild-cardsymbol.png" width="170" height="170" alt="Wild">`;
            textBottom.innerHTML = `<img src="/Proyecto de web(Uno)/frontend/assets/Images/wild-cardsymbol.png" width="40" height="40" alt="Wild">`;
        } else if (card.value === 'wild4') {
            textTop.innerHTML = `<img src="/Proyecto de web(Uno)/frontend/assets/Images/plusfour-cardsymbol.png" width="50" height="50" alt="Wild +4">`;
            textCenter.innerHTML = `<img src="/Proyecto de web(Uno)/frontend/assets/Images/4cards-cardsymbol.png" width="150" height="150" alt="Wild +4">`;
            textBottom.innerHTML = `<img src="/Proyecto de web(Uno)/frontend/assets/Images/plusfour-cardsymbol-inverted.png" width="50" height="50" alt="Wild +4">`;
        } else {
            //Para cartas normales (números)
            textTop.textContent = card.value;
            textCenter.textContent = card.value;
            textBottom.textContent = card.value;
        }
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

//Renderizar la mano del jugador
export function renderPlayerHand(playerId, hand) {
    console.log(`Renderizando mano del jugador ${playerId}:`, JSON.stringify(hand, null, 2)); //Depurar
    const container = document.querySelector(`.player-${playerId} .cards-wrapper`);
    if (!container) {
        console.error(`Contenedor no encontrado para jugador ${playerId}`); //Depurar
        return;
    }

    //Limpiar el contenedor completamente antes de renderizar
    container.innerHTML = '';

    const player = gameState.players.find(p => p.id === playerId);
    const isBot = player ? player.isBot : false;

    //Verificar que la mano (hand) del jugador existe y no es null
    if (!hand || !Array.isArray(hand)) {
        console.warn(`Hand inválida para jugador ${playerId}:`, hand); //Depurar
        return;
    }

    //Dividir las cartas en primera y segunda fila para mejorar la experiencia de usuario y evitar conflictos (en lo más posible) de diseño
    const firstRowCards = hand.slice(0, 7);
    const secondRowCards = hand.slice(7);

    //Crear la primera fila de cartas
    const firstRow = document.createElement('div');
    firstRow.className = 'first-row';
    container.appendChild(firstRow);

    //Renderizar primera fila de cartas
    firstRowCards.forEach((card, index) => {
        if (!card || !card.id) {
            console.warn(`Carta inválida en índice ${index} para jugador ${playerId}:`, card); //Depurar
            return;
        }

        const cardElement = createCardElement(card);

        if (isBot) {
            cardElement.classList.add('bot-card');
            cardElement.style.transform = 'none';
        }

        cardElement.classList.add('card-fly');
        cardElement.dataset.playerId = playerId;
        cardElement.dataset.cardIndex = index;

        firstRow.appendChild(cardElement);
    });

    //Crear y renderizar segunda fila de cartas si y solo si hay más de 7 cartas
    if (secondRowCards.length > 0) {
        const secondRow = document.createElement('div');
        secondRow.className = 'second-row';
        container.appendChild(secondRow);

        secondRowCards.forEach((card, index) => {
            if (!card || !card.id) {
                console.warn(`Carta inválida en índice ${index + 7} para jugador ${playerId}:`, card); //Depurar
                return;
            }

            const cardElement = createCardElement(card);

            if (isBot) {
                cardElement.classList.add('bot-card');
                cardElement.style.transform = 'none';
            }

            cardElement.classList.add('card-fly');
            cardElement.dataset.playerId = playerId;
            cardElement.dataset.cardIndex = index + 7;

            secondRow.appendChild(cardElement);
        });
    }
}

//Función para destacar al jugador que tiene el poder de mover sus cartas
export function highlightCurrentPlayer() {
    console.log('Resaltando jugador actual:', gameState.currentPlayerIndex); //Depurar
    const { players, currentPlayerIndex } = gameState;

    players.forEach((player, index) => {
        const playerArea = document.querySelector(`.player-${player.id}`);
        if (!playerArea) {
            console.error(`Área del jugador ${player.id} no encontrada`); //Depurar
            return;
        }

        const nameElement = playerArea.querySelector('.highlight-name');
        if (!nameElement) {
            console.error(`Elemento highlight-name no encontrado para jugador ${player.id}`); //Depurar
            return;
        }

        if (index === currentPlayerIndex) {
            nameElement.classList.add('current-player');
        } else {
            nameElement.classList.remove('current-player');
        }
    });
}

//Renderizado de cartas para todos los jugadores
export function renderAllPlayersHands() {
    console.log('Renderizando todas las manos:', JSON.stringify(gameState.players, null, 2));
    
    if (!gameState.players || gameState.players.length === 0) {
        console.warn('No hay jugadores para renderizar'); //Depurar
        return;
    }

    gameState.players.forEach(player => {
        if (!player || !player.hand) {
            console.warn(`Jugador inválido:`, player); //Depurar
            return;
        }

        const container = document.querySelector(`.player-${player.id} .cards-wrapper`);
        if (container) {
            renderPlayerHand(player.id, player.hand);
        } else {
            console.warn(`Contenedor no encontrado para jugador ${player.id}, omitiendo renderizado`); //Depurar
        }
    });
}