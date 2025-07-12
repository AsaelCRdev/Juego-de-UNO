import { playCard } from './server/api.js';
//Definir el gameState
export const gameState = {
    gameId: null,
    finished: false,
    players: [],
    discardPile: [],
    currentPlayerIndex: 0,
    direction: 1,
    scores: [0, 0, 0, 0],
    currentColor: null
};

//Función para actualizar la zona de descarte (cartas ya jugadas por los jugadores)
export function updateDiscardZone(playedCard) {
    console.log('Actualizando zona de descarte:', JSON.stringify(playedCard, null, 2)); //Depurar
    const discardZone = document.getElementById('discard-zone');
    if (!discardZone) { //Manejo de error
        console.error('Zona de descarte no encontrada'); //Depurar
        return;
    }

    discardZone.innerHTML = ''; //Limpiar el contenedor
    const front = document.createElement('div');
    if (playedCard.type === 'wild' || playedCard.type === 'wild4') { //Si es Wild o Wild4, se genera la carta, pero con el frente de la(s) cartas adaptadas a las cartas Wild.
        front.className = 'front-black';
    } else {
        front.className = `front-${playedCard.color}`; //Sino, se genera el frente de las cartas normales 
    }
    front.style.transform = 'none';
    front.style.backfaceVisibility = 'visible';
    front.style.pointerEvents = 'none';
    const colorDiv = document.createElement('div');
    if (playedCard.type === 'wild' || playedCard.type === 'wild4') {
        colorDiv.className = 'black';
    } else {
        colorDiv.className = playedCard.color;
    }
    const textTop = document.createElement('div'); //Creación del texto (parte superior izquierda de la carta)
    textTop.className = 'text-top';
    const textCenter = document.createElement('div'); //Creación de la imágen o el texto característico de la carta (centro de la carta)
    textCenter.className = 'text-center';
    const textBottom = document.createElement('div'); //Creación del texto (parte inferior derecha de la carta)
    textBottom.className = 'text-bottom';
    const basePath = '/Proyecto de web(Uno)/frontend/assets/Images/'; //"basePath" creado para mejorar el manejo de rutas, si una ruta cambia, solo se cambia el "basePath"
    if (['draw2', 'reverse', 'skip', 'wild', 'wild4'].includes(playedCard.type)) { //Creación de cartas especiales
        if (playedCard.type === 'draw2') {
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
        } else if (playedCard.type === 'wild4') {
            textTop.innerHTML = `<img src="${basePath}plusfour-cardsymbol.png" width="50" height="50" alt="Wild +4">`;
            textCenter.innerHTML = `<img src="${basePath}4cards-cardsymbol.png" width="150" height="150" alt="Wild +4">`;
            textBottom.innerHTML = `<img src="${basePath}plusfour-cardsymbol-inverted.png" width="50" height="50" alt="Wild +4">`;
        }
    } else { //Creación de cartas normales
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

//showWildColorPicker de la entrega anterior sin estilo (adaptado para esta entrega)
/*export async function showWildColorPicker(card) {
    const player = gameState.players[gameState.currentPlayerIndex];
    if (!player || player.isBot) return;
    const colorOptions = ['red', 'yellow', 'green', 'blue'];
    const chosenColor = prompt('Choose a color: red, yellow, green, or blue');
    if (colorOptions.includes(chosenColor)) {
        const response = await playCard(gameState.gameId, card, chosenColor);
        if (response) {
            // Las actualizaciones AHORA las maneja el WebSocket.js
        }
    } else {
        alert('Invalid color. Try again.');
        showWildColorPicker(card);
    }
}*/

//Funcionalidad para escoger el color de cartas una vez lanzado un "wild" o un "wild4", se incorpora un modal para seleccionar el color de la carta a jugar en el próximo movimiento
export async function showWildColorPicker(card) {
    const player = gameState.players[gameState.currentPlayerIndex];
    if (!player || player.isBot) return;

    //Crear el modal correspondiente
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
    modal.style.fontFamily = 'Arial, sans-serif';

    //Contenido del modal (la selección del color mediante la muestra de los colores disponibles, se elimina la introducción de datos por parte del usuario)
    modal.innerHTML = `
        <h2 style="color: #d87c3a; margin-bottom: 1em;">¡Elige un color!</h2>
        <div style="display: flex; justify-content: center; gap: 1em;">
            <button class="color-button" data-color="red" style="
                background-color: #ff0000;
                color: white;
                border: none;
                padding: 10px 20px;
                font-size: 1.2rem;
                border-radius: 0.5em;
                cursor: pointer;
            ">Rojo</button>
            <button class="color-button" data-color="yellow" style="
                background-color: #ffff00;
                color: black;
                border: none;
                padding: 10px 20px;
                font-size: 1.2rem;
                border-radius: 0.5em;
                cursor: pointer;
            ">Amarillo</button>
            <button class="color-button" data-color="green" style="
                background-color: #00ff00;
                color: black;
                border: none;
                padding: 10px 20px;
                font-size: 1.2rem;
                border-radius: 0.5em;
                cursor: pointer;
            ">Verde</button>
            <button class="color-button" data-color="blue" style="
                background-color: #0000ff;
                color: white;
                border: none;
                padding: 10px 20px;
                font-size: 1.2rem;
                border-radius: 0.5em;
                cursor: pointer;
            ">Azul</button>
        </div>
    `;

    //Añadir el modal al DOM del juego
    document.body.appendChild(modal);

    //Manejar clics en los botones de color
    const colorButtons = modal.querySelectorAll('.color-button');
    return new Promise((resolve) => { //Generar la nueva promesa
        colorButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const chosenColor = button.dataset.color;
                modal.remove(); //Cerrar el modal
                const response = await playCard(gameState.gameId, card, chosenColor);
                resolve(response); //Resolver la promesa con la respuesta
            });
        });
    });
}

//Función para robar cartas del mazo
export function drawCards(player, count) {
    const newCards = [];
    for (let i = 0; i < count && gameState.drawPile.length > 0; i++) {
        newCards.push(gameState.drawPile.pop());
    }
    player.hand.push(...newCards);
    renderPlayerHand(player.id, player.hand);
}