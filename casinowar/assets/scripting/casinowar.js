const blackjackGame = (() => {
  ('use strict');
  //* Variables for the game
  let deck = []; // Initialize an empty array to hold the deck of cards
  const suits = ['C', 'D', 'H', 'S']; // Array of card suits
  const specials = ['A', 'J', 'Q', 'K']; // Array of special card values
  let playerHand = []; // Initialize an empty array to hold player's hand
  let dealerHand = []; // Initialize an empty array to hold dealer's hand
  let playerScore = 0; // Initialize player's score to 0
  let dealerScore = 0; // Initialize dealer's score to 0

  //* HTML references
  const [playerScoreHTML, dealerScoreHTML] = document.querySelectorAll('span');
  const standButton = document.querySelector('#stand-button');
  const drawCardButton = document.querySelector('#draw-card-button');
  const newGameButton = document.querySelector('#new-game-button');
  const cardsContainerHTML = document.querySelectorAll('.cards-container');

//* Functions
// Function to start the game
const startGame = () => {

    resetGame();

    dealInitialCards();

    stand();

   // alert('done deal!');

};

  /**
   * Create a deck of playing cards
   * @returns {Array} - The deck of cards
   */
  const createDeck = () => {
    deck = [];
    for (let i = 2; i <= 10; i++) {
      for (let suit of suits) {
        deck.push(i + suit); // Add number and suit to deck
      }
    }
    for (let special of specials) {
      for (let suit of suits) {
        deck.push(special + suit); // Add special card and suit to deck
      }
    }
    return deck;
  };

  /**
   * Shuffles the elements of an array 'deck' using the Fisher-Yates algorithm
   * @param {Array} deck - The deck of cards to be shuffled
   * @returns {Array} - The shuffled deck
   */
  const shuffleDeck = deck => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  };

  // Function to deal initial cards to the player and the dealer
  const dealInitialCards = () => {

    deck = createDeck();

    shuffleDeck(deck);

    // Deal cards to the player and the dealer

    var TARGET_CARDS_PER_PERSON =1;

    for (let i = 0; i < TARGET_CARDS_PER_PERSON; i++) {

      playerHand.push(deck.pop());

      dealerHand.push(deck.pop());

    }

    renderInitialCardImages(playerHand, dealerHand);

    playerScore = calculateHandScore(playerHand);

    dealerScore = calculateHandScore(dealerHand);

    playerScoreHTML.innerText = playerScore;

    dealerScoreHTML.innerText = dealerScore;

  };

  /**
   * Function to determine the numerical value of a card
   * @param {string} card - The card to evaluate
   * @returns {number} - The numerical value of the card
   */
  const getCardValue = card => {
    const value = card.slice(0, -1);
    return isNaN(value) ? (value === 'A' ? 11 : 10) : Number(value);
  };

/**
* Function to calculate the score of a hand in a blackjack game
* Aces can have a value of 1 or 11, and face cards (J, Q, K) have a value of 10
* @param {Array} hand - An array containing the cards in the hand
* @returns {number} - The total score of the hand
*/
const calculateHandScore = hand => {

    let totalScore = 0;

    let numberOfAces = 0;

    // Calculate total score and count Aces

    hand.forEach(card => {

        if (isAce(card)) numberOfAces++;

        totalScore += getCardValue(card);

    });

    // Adjust score for Aces

    for (let i = 0; i < numberOfAces; i++) {

        if (totalScore > 21) totalScore -= 10; // If adding 11 would exceed 21, use Ace as 1

    }

    // alert(totalScore);

    return totalScore;

};

  /**
   * Function to check if a card is an Ace
   * @param {string} card - The card to evaluate
   * @returns {boolean} - True if the card is an Ace, false otherwise
   */
  const isAce = card => {
    return card.startsWith('A');
  };

  // Function to draw a card from the deck
  const drawCard = () => {
    if (deck.length === 0) {
      throw new Error('No hay cartas en la baraja');
    }
    return deck.pop();
  };

  /**
   * Renders the initial card images for the player and dealer
   * @param {Array} playerHand - An array containing the initial cards of the player
   * @param {Array} dealerHand - An array containing the initial cards of the dealer
   */
  const renderInitialCardImages = (playerHand, dealerHand) => {
    renderHand(playerHand, cardsContainerHTML[0]);
    renderHand(dealerHand, cardsContainerHTML[1]);
  };

  /**
   * Renders the cards in a hand to a specified container
   * @param {Array} hand - An array containing the cards to render
   * @param {HTMLElement} container - The container element where the cards will be rendered
   */
  const renderHand = (hand, container) => {
    // Clean up the container before rendering the cards
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    hand.forEach(card => {
      const cardImage = document.createElement('img');
      cardImage.src = `assets/cards/${card}.png`;
      cardImage.classList.add('card');
      container.appendChild(cardImage);
    });
  };

  // Function to handle the player standing in the game
  const stand = () => {

      determineWinner(playerScore, dealerScore);

 
  };

  /**
   * Function to manage the dealer's turn in the game
   * @param {number} minScore - The minimum score the dealer must reach
   */
  const dealerTurn = minScore => {
    do {
      const card = deck.pop();
      dealerHand.push(card);
      renderHand(dealerHand, cardsContainerHTML[1]);
      dealerScore = calculateHandScore(dealerHand);
      dealerScoreHTML.innerText = dealerScore;
      // If the minimum score exceeds 21, stop drawing cards
      if (minScore > 21) break;
    } while (dealerScore < minScore && minScore <= 21);

    determineWinner(playerScore, dealerScore);
  };

/**
* Function to display a message using an alert dialog after a delay
* @param {string} message - The message to display
* @param {number} delay - The delay in milliseconds before displaying the message
*/
const showMessageWithDelay = (message, delay) => {

    setTimeout(() => {

        $('#serverChat').text(message);

    }, delay);

};

    /**
    * Function to determine the winner of a blackjack game
    * @param {number} playerScore - The score of the player
    * @param {number} dealerScore - The score of the dealer
    */
    const determineWinner = (playerScore, dealerScore) => {

    if (playerScore > 21) {

        showMessageWithDelay('player has busted. dealer wins.', 500);

    } else if (dealerScore > 21) {

    showMessageWithDelay('dealer has busted. player wins.', 500);

    } else if (playerScore > dealerScore) {

    showMessageWithDelay('player beats dealer. player wins.', 500);

    } else if (dealerScore > playerScore) {

    showMessageWithDelay('dealer beats player. dealer wins.', 500);

    } else {

    showMessageWithDelay('its a tie! push.', 500);

    }

    };

  // Funtion to reset the game
  const resetGame = () => {
    deck = [];
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    playerScoreHTML.innerText = playerScore;
    dealerScoreHTML.innerText = dealerScore;
    cardsContainerHTML.forEach(container => (container.innerHTML = ''));


  };

  // Add event listener to the new game button
  newGameButton.addEventListener('click', () => {
    resetGame();
    startGame();
  });

  return {
    newGame: startGame,
  };
})();
