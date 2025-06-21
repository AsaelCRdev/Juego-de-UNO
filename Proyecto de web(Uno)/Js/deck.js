//Función para crear todas las cartas del mazo
function createDeck() {
    const colors = ['red', 'yellow', 'green', 'blue'];
    const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'drawTwo'];
    let deck = [];

    //Cartas numeradas normales (0-9) - dos por color excepto el 0
    for (let color of colors) {
        for (let value of values) {
            deck.push({ color, value });
            if (value !== '0') {
                deck.push({ color, value }); // Dos cartas de cada valor excepto el 0
            }
        }
    }

    // Cartas especiales: Wild y Wild Draw Four
    for (let i = 0; i < 4; i++) {
        deck.push({ color: 'wild', value: 'wild' });
        deck.push({ color: 'wild', value: 'drawFour' });
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

    // Repartir 7 cartas a cada jugador
    players.forEach(player => {
        player.hand = deck.splice(0, 7); // Asignar 7 cartas al jugador
    });

    return deck; // Este es el mazo restante (drawPile)
}

export { initializeDeck };