document.addEventListener('DOMContentLoaded', function() {
    const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '+2', '+4', 'invertir'];
    const colors = ['red', 'green', 'blue', 'yellow'];
    const cardsByPlayer = 7;
    const valoresNumericos = values.filter(v => !['+2', '+4', 'invertir'].includes(v));
    const discardCardValue = valoresNumericos[Math.floor(Math.random() * valoresNumericos.length)];
    const discardCardColor = colors[Math.floor(Math.random() * colors.length)];

    const discardContainer = document.getElementById('discard-zone-container');
    const discardCard = document.getElementById('discard-zone');
    if (discardCard) {
            const initialCard = createFrontCard(discardCardValue, discardCardColor);

            discardContainer.style.backgroundColor = discardCardColor;
            discardCard.appendChild(initialCard);

    }

    /*Lo usamos para crear las cartas que ve el usuario principal*/
    function createFrontCard(value, color) {
        const li = document.createElement('li');
        li.className = 'card';
        li.setAttribute('data-value', value);
        li.setAttribute('data-color', color);
        li.style.backgroundColor = color;

        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        const front = document.createElement('div');
        front.className = 'front';

        if (value === 'invertir') {
            const img = document.createElement('img');
            img.src = '/Vista/Imagenes/reverse-cardsymbol.png';
            img.alt = 'Invertir';
            img.className = 'carta-invertir';
            img.style.width = '32px';
            img.style.height = '32px';
            front.appendChild(img);
        } else {
            const frontBg = document.createElement('div');
            frontBg.className = 'front-bg' + (['+2','+4'].includes(value) ? ' accion' : '');
            frontBg.setAttribute('data-color', color);
            frontBg.textContent = value;
            front.appendChild(frontBg);
        }

        cardInner.appendChild(front);
        li.appendChild(cardInner);
        return li;
    }
    /*Lo usamos para crear la carta de reverso que tienen los otros jugadores*/
    function createBackCard(value, color) {
        const li = document.createElement('li');
        li.className = 'card';
        li.setAttribute('data-value', value);
        li.setAttribute('data-color', color);
        
        const back = document.createElement('div');
        back.className = 'back';

        const backBg = document.createElement('div');
        backBg.className = 'back-bg';

        const p = document.createElement('p');
        p.className = 'uno';
        p.textContent = 'UNO';

        backBg.appendChild(p);
        back.appendChild(backBg);
        li.appendChild(back);
        return li;
    }
    

    for (let i = 1; i <= 4; i++) {
        const hand = document.getElementById('playerhand' + i);
        if (hand) {
            for (let j = 0; j < cardsByPlayer; j++) {
                const value = values[Math.floor(Math.random() * values.length)];
                const color = colors[Math.floor(Math.random() * colors.length)];
                let carta;
                if (i === 1) {
                    carta = createFrontCard(value, color);
                } else {
                    carta = createBackCard(value, color);
                }
                hand.appendChild(carta);
            }
        }
    }
});