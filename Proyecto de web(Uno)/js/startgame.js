const discardZone = document.getElementById("discardZone");
const skipTurnbutton = document.getElementById("skipTurn");
let playerturn = true;

if (skipTurnBtn) {
    skipTurnBtn.addEventListener('click', function() {
        if (playerturn) {
            playerturn = false;
            setTimeout(playersBot, 1000);
        }
    });
}

function validateCard(card,discardZoneCard){
    if(discardZoneCard.getAttribute('data-value') === card.getAttribute('data-value') || discardZoneCard.getAttribute('data-color') === card.getAttribute('data-color')) {
        return true;
    }
    return false;
}

function onCartaJugadorClick(e) {
    if (!playerturn) return; 
    const card = e.currentTarget;
    const discardCard = discardZone.lastElementChild;
    if (validateCard(card, discardCard)) {
        discardZone.appendChild(card);
        playerturn = false;
        setTimeout(playersBot, 1000);
    }
}
function activatePlayerTurn() {
    const playerhand = document.getElementById('playerhand1');
    Array.from(playerhand.children).forEach(li => {
        li.replaceWith(li.cloneNode(true));
    });
    Array.from(playerhand.children).forEach(li => {
        li.addEventListener('click', onCartaJugadorClick);
    });
}


function playersBot(){
    for (let i = 2; i <= 4; i++) {
        const cpuhand = document.getElementById('playerhand' + i);
        const discardCard = discardZone.lastElement
        let cpucard = null;
        if (cartaSuperior) {
            for (let li of cpuhand.children) {
                if (validateCard(li,discardCard)) {
                    cpucard = li;
                    break
                }
            }
            if (cpucard) {
                discardZone.appendChild(cpucard)
            }
            playerturn = true
            activatePlayerTurn()
            break;
        }
    }
}

activatePlayerTurn()