/**
 * contains logic that sets next study interval
 */
export const BTTN_AGAIN = 'AGAIN';
export const BTTN_GOOD = 'GOOD';
export const STATE_LEARNING = 'LEARNING';
export const STATE_GRADUATED = 'GRADUATED';
export const LEECH_THRESHOLD = 8;
export const DUR_10M = '10m';
export const GRADUATE_INTERVAL = 2.5;
export const MAX_TIMEOUT = '90d';

export const setTimeoutDate = (card, buttonPressed) => {
    console.log('inside setTimeoutDate');
    // NEW CARD
    if (!card.state || card.state === STATE_LEARNING) {
        card.state = STATE_LEARNING;
        console.log('setTimeoutDate learning 1');
        if (buttonPressed === BTTN_AGAIN) { // AGAIN in 10m
            setTimeout(card, DUR_10M);
            card.good = 0;
            console.log('setTimeoutDate 2');
            return;
        } else if (!card.good || card.good === 0) { // Good x1 in 1d
            setTimeout(card, '1d');
            card.good = 1;
            console.log('setTimeoutDate 3');
            return;
        } else if (card.good < 2) { // Good x2 in 3d
            setTimeout(card, '3d');
            card.good = 2;
            console.log('setTimeoutDate 4');
            return;
        } else { // Graduate
            card.state = STATE_GRADUATED;
            card.good = 0;
            console.log('setTimeoutDate 5');
        }
    } 
    // GRADUATED CARD
    if (card.state === STATE_GRADUATED) {
        console.log('setTimeoutDate graduate');
        if (buttonPressed === BTTN_AGAIN) { // AGAIN
            card.good = 0; // reset good counter
            setTimeout(card, DUR_10M);
            // again counter for leech threshold
            if (card.again) {
                card.again += 1; // forgot not first time
            } else {
                card.again = 0; // forgot first time
            }
            if (card.again >= LEECH_THRESHOLD) {
                card.tag = "too many revisions"
            }
            console.log('setTimeoutDate again');
        } else { // GOOD
            if (!card.good || card.good === 0) {
                card.good = 1;
                setTimeout(card, '7d');
                console.log('setTimeoutDate good 1');
            } else {
                card.good += 1;
                multiplyTimeout(card);
                console.log('setTimeoutDate good 2');
            }
        }
    }
};

export const multiplyTimeout = (card) => {
    card.timeout *= GRADUATE_INTERVAL;
};

const setTimeout = (card, timeout) => {
    card.timeout = timeout;
};