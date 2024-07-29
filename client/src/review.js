import moment from 'moment';

/**
 * contains logic that sets next study interval
 */
export const BTTN_AGAIN = 'AGAIN';
export const BTTN_GOOD = 'GOOD';
export const STATE_LEARNING = 'LEARNING';
export const STATE_GRADUATED = 'GRADUATED';
export const LEECH_THRESHOLD = 8;
export const DUR_10M = { minutes:10 };
export const DUR_1D = { days:1 };
export const DUR_3D = { days:3 };
export const DUR_7D = { days:7 };
export const GRADUATE_INTERVAL = 2.5;
export const MAX_TIMEOUT = { days:90 };

export const setTimeoutDate = (card, buttonPressed) => {
    // NEW CARD
    if (!card.state || card.state === STATE_LEARNING) {
        card.state = STATE_LEARNING;
        if (buttonPressed === BTTN_AGAIN) { // AGAIN in 10m
            setTimeout(card, DUR_10M);
            card.good = 0;
            return;
        } else if (!card.good || card.good === 0) { // Good x1 in 1d
            setTimeout(card, DUR_1D);
            card.good = 1;
            return;
        } else if (card.good < 2) { // Good x2 in 3d
            setTimeout(card, DUR_3D);
            card.good = 2;
            return;
        } else { // Graduate
            card.state = STATE_GRADUATED;
            card.good = 0;
        }
    } 
    // GRADUATED CARD
    if (card.state === STATE_GRADUATED) {
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
        } else { // GOOD
            if (!card.good || card.good === 0) {
                card.good = 1;
                setTimeout(card, DUR_7D);
            } else {
                card.good += 1;
                multiplyTimeout(card);
            }
        }
    }
};

export const multiplyTimeout = (card) => {
    var interval = moment().add(card.lastInterval).unix() - moment().unix();
    interval *= GRADUATE_INTERVAL;
    interval = {'seconds': interval};

    // if interval is less than max allowed interval, set it
    if (moment().add(MAX_TIMEOUT).isAfter(moment().add(interval))) {
        card.lastInterval = interval;
        card.reviewDate = moment().add(card.lastInterval);
    } else {
        // set the max interval
        card.lastInterval = MAX_TIMEOUT;
        card.reviewDate = moment().add(MAX_TIMEOUT);
    }
};

const setTimeout = (card, timeout) => {
    card.reviewDate = moment().add(timeout);
    card.lastInterval = timeout;
};
