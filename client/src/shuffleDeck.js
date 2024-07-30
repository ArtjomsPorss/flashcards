import moment from 'moment';

export const shuffleDeck = (cards) => {
    // Shuffle function using Fisher-Yates algorithm
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Separate the cards into no-date + past-date, and future-date groups
    const noDateAndDueCards = [];
    const futureDateCards = [];

    const now = moment();

    cards.forEach(card => {
      if (!card.date) {
        noDateAndDueCards.push(card);
      } else {
        const cardDate = moment(card.date);
        if (cardDate.isBefore(now)) {
          noDateAndDueCards.push(card);
        } else {
          futureDateCards.push(card);
        }
      }
    });

    // Shuffle the no-date and past-date groups
    shuffle(noDateAndDueCards);

    // Sort the future-date cards by ascending date
    futureDateCards.sort((a, b) => moment(a.date).diff(moment(b.date)));

    // Concatenate the groups to form the final sorted array
    const sortedCards = [...noDateAndDueCards, ...futureDateCards];

    return sortedCards;
}

