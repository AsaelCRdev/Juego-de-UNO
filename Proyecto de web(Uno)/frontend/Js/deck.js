// Función para crear todas las cartas del mazo
/* 
------------------------------------------------------------------------------------------------------------------------
    Archivo .js NO FUNCIONAL para esta segunda entrega, reemplazado por la lógica dada por la profesora, Stephanie Cruz 
------------------------------------------------------------------------------------------------------------------------
*/
function createDeck() {
    const colors = ['red', 'yellow', 'green', 'blue'];
    const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'drawTwo'];
    let deck = [];

    // Cartas normales y especiales por color
    for (let color of colors) {
        for (let value of values) {
            const isNumber = !isNaN(parseInt(value));
            const type = isNumber ? 'number' : value;

            // Crear carta
            const card = {
                id: `${color[0].toUpperCase()}-${value.toUpperCase()}`, // Ej:R-5, B-SKIP
                color,
                type,
                value: value
            };

            deck.push(card);

            // Dos cartas de cada valor excepto 0
            if (value !== '0') {
                deck.push({ ...card });
            }
        }
    }

    //Wilds
    for (let i = 0; i < 4; i++) {
        deck.push({
            id: `WILD-WILD`,
            color: 'wild',
            type: 'wild',
            value: 'wild'
        });

        deck.push({
            id: `WILD-DRAWFOUR`,
            color: 'wild',
            type: 'drawFour',
            value: 'drawFour'
        });
    }

    return deck;
}

//Función para barajar el mazo
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

//Función principal: reparte cartas iniciales a los jugadores
function initializeDeck(players) {
    const deck = createDeck();
    shuffleDeck(deck);

    // Buscar una carta inicial que NO sea comodín, ni reverse, ni skip
    let firstCardIndex = deck.findIndex(card => 
        card.type === 'number' && !['reverse', 'skip', 'wild', 'drawFour'].includes(card.value)
    );

    // Si no se encuentra, usar la primera carta
    if (firstCardIndex === -1) firstCardIndex = 0;

    const initialCard = deck[firstCardIndex];

    // Eliminar esa carta del mazo
    const newDeck = [
        ...deck.slice(0, firstCardIndex),
        ...deck.slice(firstCardIndex + 1)
    ];

    // Repartir cartas a cada jugador
    players.forEach(player => {
        player.hand = newDeck.splice(0, 7); // Asignar 7 cartas al jugador
    });

    return [initialCard, ...newDeck]; // Devolver el mazo con la carta inicial en primer lugar
}

export { initializeDeck };