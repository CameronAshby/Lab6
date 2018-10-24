let deck = {};
let pOneTotal = 0;
let pTwoTotal = 0;

let pOneStand = false;
let pTwoStand = false;

let evalAce = false;

let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = () => {
    if(httpRequest.readyState == XMLHttpRequest.DONE) {
        let response = JSON.parse(httpRequest.response);
        if(response.success) {
            deck.id = response.deck_id;
        }

        // Need To Wait For Other Response From Above Before Executing
        getTwoCards('One');
        deck.remaining = response.remaining-4;
    }
};

httpRequest.open('GET', 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
httpRequest.send();

function getTwoCards(playerNum) {
    let cardHttpRequest = new XMLHttpRequest();
    cardHttpRequest.onreadystatechange = () => {
        if(cardHttpRequest.readyState == XMLHttpRequest.DONE) {
            let response = JSON.parse(cardHttpRequest.response);
            if(response.success) {
                // Display To HTML
                if(playerNum == 'One') {
                    $('.pOneCardOne').attr('src', response.cards[0].image);
                    $('.pOneCardTwo').attr('src', response.cards[1].image);
                }
                else {
                    $('.pTwoCardOne').attr('src', response.cards[0].image);
                    $('.pTwoCardTwo').attr('src', response.cards[1].image);
                }
                getValue(response.cards[0].code, playerNum);
                getValue(response.cards[1].code, playerNum);
            }
        }
    };

    cardHttpRequest.open('GET', `https://deckofcardsapi.com/api/deck/${deck.id}/draw/?count=2`);
    cardHttpRequest.send();
}

function drawCard(playerNum) {
    let drawHttpRequest = new XMLHttpRequest();
    drawHttpRequest.onreadystatechange = () => {
        if(drawHttpRequest.readyState == XMLHttpRequest.DONE) {
            let response = JSON.parse(drawHttpRequest.response);
            if(response.success) {
                // Display To HTML
                if(playerNum == 'One') {
                    $('.cardContainerOne').append('<img src="'+response.cards[0].image+'">');
                    getValue(response.cards[0].code, playerNum);
                }
                else {
                    $('.pTwoDrawContainer').append('<img src="'+response.cards[0].image+'">');
                    getValue(response.cards[0].code, playerNum);
                }
                deck.remaining -= 1;
            }
        }
    };

    drawHttpRequest.open('GET', `https://deckofcardsapi.com/api/deck/${deck.id}/draw/?count=1`);
    drawHttpRequest.send();
}

function getValue(code, playerNum) {
    let val;
    if(code.charAt(0) == 'K' || code.charAt(0) == 'Q' || code.charAt(0) == 'J' || code.charAt(0) == 0) {
        val = 10;
    }
    else if(code.charAt(0) == 'A') {
        val = 0;
        evalAce = true;
    }
    else {
        val = Number(code.charAt(0));
    }
    return totalValue(val, playerNum);
}

function totalValue(cardVal, playerNum) {
    if (playerNum === 'One') {
        pOneTotal += cardVal;
        $('.pOneTotal').text(pOneTotal);
    }
    else {
        pTwoTotal += cardVal;
        $('.pTwoTotal').text(pTwoTotal);
    }
    endGame();
}

function stand(playerNum) {
    if(playerNum == 'One') {
        pOneStand = true;
        $('.standOne').attr('onclick', 'disabled');
        $('.hitOne').attr('onclick', 'disabled');
        getTwoCards('Two');
        evaluateAce(playerNum);
    }
    else {
        pTwoStand = true;
        $('.standTwo').attr('onclick', 'disabled');
        $('.hitTwo').attr('onclick', 'disabled');
        evaluateAce(playerNum);
    }

    endGame();
}

function evaluateAce(playerNum) {
    if(evalAce == true) {
        let addVal = prompt('Would you like your Ace to equal 1 or 11?');
        evalAce = false;
        totalValue(Number(addVal), playerNum);
    }
}

function endGame() {
    if(pOneTotal > 21) {
        alert('Exceeded 21. Player Two Wins!');
        disable();
    }
    else if(pTwoTotal > 21) {
        alert('Exceeded 21. Player One Wins!');
        disable();
    }

    if(pOneStand == true && pTwoStand == true) {
        disable();

        if(pOneTotal > pTwoTotal) {
            alert('Player One Wins!');
        }
        else if (pOneTotal == pTwoTotal) {
            alert('Game Ended in a Tie!')
        }
        else {
            alert('Player Two Wins!');
        }
    }
}

function disable() {
    $('.standOne').attr('onclick', 'disabled');
    $('.hitOne').attr('onclick', 'disabled');
    $('.standTwo').attr('onclick', 'disabled');
    $('.hitTwo').attr('onclick', 'disabled');
}