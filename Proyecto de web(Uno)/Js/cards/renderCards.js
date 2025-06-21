import { gameState } from '../gameState.js';

function createCardElement(card) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';

    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    // BACK (parte trasera) (Círculo con UNO)
    const back = document.createElement('div');
    back.className = 'back';

    const circleBack = document.createElement('div');
    circleBack.className = 'red'; // Círculo blanco siempre

    const textUNO = document.createElement('div');
    textUNO.className = 'text';
    textUNO.textContent = 'UNO';

    back.appendChild(circleBack);
    back.appendChild(textUNO);

    // FRONT (frente) (Números, colores...)
    let frontColor = card.color;

    // Si es wild o drawFour
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
        textTop.innerHTML = `<img src="/Juego-de-UNO/Proyecto de web(Uno)/assets/Images/plustwo-cardsymbol.png" width="50" height="50" alt="Draw Two">`;
        textCenter.innerHTML = `<img src="/Juego-de-UNO/Proyecto de web(Uno)/assets/Images/drawtwocard-cardsymbol.png" width="100" height="100" alt="Draw Two">`;
        textBottom.innerHTML = `<img src="/Juego-de-UNO/Proyecto de web(Uno)/assets/Images/plustwo-cardsymbol-inverted.png" width="50" height="50" alt="Draw Two">`;
    } else if (card.value === 'reverse') {
        textTop.innerHTML = `<img src="/Juego-de-UNO/Proyecto de web(Uno)/assets/Images/reverse-cardsymbol.png" width="50" height="50" alt="Reverse">`;
        textCenter.innerHTML = `<img src="/Juego-de-UNO/Proyecto de web(Uno)/assets/Images/reverse-cardsymbol.png" width="100" height="100" alt="Reverse">`;
        textBottom.innerHTML = `<img src="/Juego-de-UNO/Proyecto de web(Uno)/assets/Images/reverse-cardsymbol.png" width="50" height="50" alt="Reverse">`;
    } else if (card.value === 'skip') {
        textTop.innerHTML = `<img src="/Juego-de-UNO/Proyecto de web(Uno)/assets/Images/skip-cardsymbol.png" width="50" height="50" alt="Skip">`;
        textCenter.innerHTML = `<img src="/Juego-de-UNO/Proyecto de web(Uno)/assets/Images/skip-cardsymbol.png" width="100" height="100" alt="Skip">`;
        textBottom.innerHTML = `<img src="/Juego-de-UNO/Proyecto de web(Uno)/assets/Images/skip-cardsymbol.png" width="50" height="50" alt="Skip">`;
    } else if (card.value === 'wild') {
        textTop.innerHTML = `<img src="/Juego-de-UNO/Proyecto de web(Uno)/assets/Images/wild-cardsymbol.png" width="40" height="40" alt="Wild">`;
        textCenter.innerHTML = `<img src="/Juego-de-UNO/Proyecto de web(Uno)/assets/Images/wild-cardsymbol.png" width="170" height="170" alt="Wild">`;
        textBottom.innerHTML = `<img src="/Juego-de-UNO/Proyecto de web(Uno)/assets/Images/wild-cardsymbol.png" width="40" height="40" alt="Wild">`;
    } else if (card.value === 'drawFour') {
        textTop.innerHTML = `<img src="/Juego-de-UNO/Proyecto de web(Uno)/assets/Images/plusfour-cardsymbol.png" width="50" height="50" alt="Wild +4">`;
        textCenter.innerHTML = `<img src="/Juego-de-UNO/Proyecto de web(Uno)/assets/Images/4cards-cardsymbol.png" width="150" height="150" alt="Wild +4">`;
        textBottom.innerHTML = `<img src="/Juego-de-UNO/Proyecto de web(Uno)/assets/Images/plusfour-cardsymbol-inverted.png" width="50" height="50" alt="Wild +4">`;
    } else {
        // Para cartas normales (números)
        textTop.textContent = card.value;
        textCenter.textContent = card.value;
        textBottom.textContent = card.value;
    }

    // Construir la carta completa
    front.appendChild(colorDiv);
    front.appendChild(textTop);
    front.appendChild(textCenter);
    front.appendChild(textBottom);

    cardDiv.appendChild(back);
    cardDiv.appendChild(front);
    cardContainer.appendChild(cardDiv);

    return cardContainer;
}

function renderPlayerHand(playerId, hand) {
    const container = document.querySelector(`.player-${playerId} .cards-wrapper`);
    if (!container) return;

    // Limpiar antes de repartir
    container.innerHTML = '';

    hand.forEach((card, index) => {
        const cardElement = createCardElement(card);

        // Aplicar clase de animación
        cardElement.classList.add('card-fly');

        // Insertar con retraso para crear efecto de reparto
        setTimeout(() => {
            container.appendChild(cardElement);
        }, index * 200); // 150ms entre carta y carta
    });
}

export function renderAllPlayersHands() {
    gameState.players.forEach(player => {
        renderPlayerHand(player.id, player.hand);
    });
}