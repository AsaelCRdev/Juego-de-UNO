document.addEventListener('DOMContentLoaded', function() {
    const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '+2', '+4', 'invertir'];
    const colors = ['red', 'green', 'blue', 'yellow'];
    const cartasPorJugador = 7;

    function crearCartaFrontal(valor, color) {
        const li = document.createElement('li');
        li.className = 'card';
        li.setAttribute('data-value', valor);
        li.setAttribute('data-color', color);

        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        const front = document.createElement('div');
        front.className = 'front';

        if (valor === 'invertir') {
            const img = document.createElement('img');
            img.src = '/Vista/Imagenes/reverse-cardsymbol.png';
            img.alt = 'Invertir';
            img.className = 'carta-invertir';
            img.style.width = '32px';
            img.style.height = '32px';
            front.appendChild(img);
        } else {
            const frontBg = document.createElement('div');
            frontBg.className = 'front-bg' + (['+2','+4'].includes(valor) ? ' accion' : '');
            frontBg.setAttribute('data-color', color);
            frontBg.textContent = valor;
            front.appendChild(frontBg);
        }

        cardInner.appendChild(front);
        li.appendChild(cardInner);
        return li;
    }

    function crearCartaReverso(valor, color) {
        const li = document.createElement('li');
        li.className = 'card';
        li.setAttribute('data-value', valor);
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
            hand.innerHTML = ''; 
            for (let j = 0; j < cartasPorJugador; j++) {
                const valor = values[Math.floor(Math.random() * values.length)];
                const color = colors[Math.floor(Math.random() * colors.length)];
                let carta;
                if (i === 1) {
                    carta = crearCartaFrontal(valor, color);
                } else {
                    carta = crearCartaReverso(valor, color);
                }
                hand.appendChild(carta);
            }
        }
    }
});