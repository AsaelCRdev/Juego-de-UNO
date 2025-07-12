export async function startNewGame() { //Iniciar un nuevo juego
    try {
        const response = await fetch('http://localhost:3001/start', {
            method: 'POST', //Solicitud POST al endpoint /start
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}) //Envía un cuerpo vacío para saber la respuesta del servidor
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) { //Si no hay respuesta, se indica el error
        console.error('Error al iniciar el juego:', error); //Depurar
        alert('ERROR: Falló al iniciar el juego. Inténtelo más tarde.');
    }
}

export async function playCard(gameId, card, chosenColor) { //Jugar una carta
    try {
        const response = await fetch('http://localhost:3001/play', {
            method: 'POST', //Solicitud POST al endpoint /play
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId, card, chosenColor }) //Se envía los datos del gameId, la carta y el color escogido
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) { //Manejo de error
        console.error('Error al jugar la carta:', error); //Depurar
        alert('Carta no válida. Por favor, intenta con otra carta.');
    }
}

export async function drawCard(gameId) { //Robar una carta
    try {
        const response = await fetch('http://localhost:3001/draw', {
            method: 'POST', //Solicitud POST al endpoint /draw
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId }) //Se envía los datos del gameId
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) { //Manejo de error
        console.error('Error al robar una carta:', error); //Depurar
        alert('Falló robar una carta. Por favor, inténtalo de nuevo.');
    }
}

export async function callUno(gameId) { //Decir UNO
    try {
        const response = await fetch('http://localhost:3001/uno', {
            method: 'POST', //Solicitud POST al endpoint /uno
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId }) //Se envía los datos del gameId
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) { //Manejo de error
        console.error('Error al presionar UNO:', error); //Depurar
        alert('No funcionó como esperaba el botón de UNO. Por favor, inténtelo de nuevo.');
    }
}

export async function startNewRound(gameId) { //Iniciar una nueva ronda y no una partida. Si se quiere iniciar una nueva partida, se usa el endpoint /start
    try {
        const response = await fetch('http://localhost:3001/new-round', {
            method: 'POST', //Solicitud POST al endpoint /new-round
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId }) //Se envía los datos del gameId
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) { //Manejo de error
        console.error('Error al iniciar una nueva ronda:', error); //Depurar
        alert('La ronda no se inició. Por favor, inténtelo de nuevo.');
    }
}