import { alphabet, gameWords } from './data.js';
import { shuffle } from './shuffle.js';

const alphabetBtnsContainer = document.querySelector('.alphabet-buttons');
const playButton = document.querySelector('.start-btn');
const head = document.querySelector('.head');
let shuffledGameWords;
let currentGameWord = [];
let correctLetters = [];
let incorrectLetters = 0;
let hangmanParts = [];
let roundsPlayed = 0;

function createAlphabetBtns() {
  alphabet.forEach((letter) => {
    let button = document.createElement('button');
    button.className = 'letter-button';
    button.textContent = letter;
    alphabetBtnsContainer.appendChild(button);
  });
}

function shuffleGameWords() {
  shuffledGameWords = shuffle(gameWords);
}

shuffleGameWords();

function displayGameSentence() {
  const sentence = shuffledGameWords[roundsPlayed];
  const sentenceContainer = document.querySelector('.game-sentence-container');

  sentence.forEach((word) => {
    const singleWord = document.createElement('span');
    singleWord.className = 'word';
    sentenceContainer.appendChild(singleWord);
    const capitalizedWord = word[0].toUpperCase();
    currentGameWord.push(capitalizedWord);

    let gameWord = capitalizedWord.split('');

    gameWord.forEach((letter) => {
      let gameWordLetter = document.createElement('p');
      gameWordLetter.className = `game-letter game-letter-${letter}`;
      gameWordLetter.textContent = letter;
      singleWord.appendChild(gameWordLetter);

      if (gameWordLetter.textContent === "'") {
        gameWordLetter.classList.add('show-letter');
        correctLetters.push(letter);
      }
    });
  });
}

function resetHangman() {
  const hangman = document.querySelector('.hangman-container').children;
  hangmanParts = [...hangman];
  hangmanParts.forEach((part) => (part.style.display = 'none'));
}

function changeFace() {
  switch (incorrectLetters) {
    case 1:
      head.src = './img/head-1.svg';
      break;
    case 2:
      head.src = './img/head-2.svg';
      break;
    case 3:
      head.src = './img/head-3.svg';
      break;
    case 4:
      head.src = './img/head-4.svg';
      break;
    case 5:
      head.src = './img/head-5.svg';
      break;
    case 6:
      head.src = './img/head-6.svg';
      break;
    default:
      head.src = './img/head-1.svg';
  }
}

function startGame() {
  if (roundsPlayed === shuffledGameWords.length) {
    shuffleGameWords();
    roundsPlayed = 0;
  }

  //resets
  currentGameWord = [];
  correctLetters = [];
  incorrectLetters = 0;
  showHide(playButton);
  showHide(alphabetBtnsContainer);
  removeElement('.letter-button');
  removeElement('.word');
  resetHangman();

  //create board
  createAlphabetBtns();
  displayGameSentence();
}

function checkForMatch(e) {
  if (e.target.classList.contains('letter-button')) {
    let matchingLetters = document.querySelectorAll(`.game-letter-${e.target.textContent}`);

    if (matchingLetters.length === 0) {
      e.target.classList.add('incorrect');
      e.target.disabled = 'true';
      incorrectLetters++;
      hangmanParts[incorrectLetters - 1].style.display = 'block';
      changeFace();
    } else {
      e.target.classList.add('correct');
      e.target.disabled = 'true';
      matchingLetters.forEach((match) => {
        match.classList.add('show-letter');
        correctLetters.push(match.textContent);
      });
    }

    //reset array for next check
    matchingLetters = [];
    checkWin();
  }
}

function checkWin() {
  const array1 = currentGameWord.join('').split('').sort().join('');
  const array2 = correctLetters.sort().join('');
  const gameWordLetters = document.querySelectorAll('.game-letter');

  if (array1 === array2) {
    showHide(alphabetBtnsContainer);
    showHide(playButton);
    roundsPlayed++;
    gameWordLetters.forEach((letter) => (letter.style.color = '#01c480'));
    head.src = './img/head-1.svg';
  }

  if (incorrectLetters === 6) {
    showHide(alphabetBtnsContainer);
    showHide(playButton);
    roundsPlayed++;
    gameWordLetters.forEach((letter) => (letter.style.color = 'red'));
  }
}

//helper functions
function showHide(element) {
  element.classList.toggle('hidden');
}

function removeElement(element) {
  const allElements = document.querySelectorAll(element);
  allElements.forEach((el) => el.remove());
}

alphabetBtnsContainer.addEventListener('click', checkForMatch);
playButton.addEventListener('click', startGame);
startGame();
