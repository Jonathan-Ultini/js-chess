// Selezione degli elementi del DOM
const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");

const width = 8; // Larghezza della scacchiera

let playerGo = 'black';
playerDisplay.textContent = 'black';

// Array con la disposizione iniziale dei pezzi sulla scacchiera
const startPieces = [
  rook, knight, bishop, queen, king, bishop, knight, rook,
  pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
  rook, knight, bishop, queen, king, bishop, knight, rook
];

// Funzione per creare la scacchiera
function createBoard() {
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement('div');
    square.classList.add('square');
    square.innerHTML = startPiece; // Inserisce il pezzo nella casella
    square.firstChild && square.firstChild.setAttribute('draggable', true)
    square.setAttribute('square-id', i); // Imposta un attributo con l'indice della casella

    // Determina il colore della casella basandosi sulla posizione
    const row = Math.floor((63 - i) / 8) + 1;
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "beige" : "brown");
    } else {
      square.classList.add(i % 2 === 0 ? "brown" : "beige");
    }

    // Imposta il colore del pezzo in base alla posizione iniziale
    if (i <= 15) {
      square.firstChild.firstChild.classList.add('black');
    }
    if (i >= 48) {
      square.firstChild.firstChild.classList.add('white');
    }

    // Aggiunge la casella alla scacchiera
    gameBoard.append(square);
  });
}

// Crea la scacchiera all'avvio
createBoard();


const allSquare = document.querySelectorAll('.square');

allSquare.forEach(square => {
  square.addEventListener('dragstart', dragStart);
  square.addEventListener('dragover', dragOver);
  square.addEventListener('drop', dragDrop);
})

let startPositionId;
let draggedElement;

function dragStart(e) {
  startPositionId = e.target.parentNode.getAttribute('square-id');
  draggedElement = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop(e) {
  e.stopPropagation();
  console.log(e.target);
  const taken = e.target.classList.contains('piece');

  //e.target.parentNode.append(draggedElement);
  //e.target.append(draggedElement);
  //e.target.remove();

  changeplayer();
}

function changeplayer() {
  if (playerGo === "black") {
    playerGo = "white";
    playerDisplay.textContent = 'white';
  } else {
    playerGo = "black"
    playerDisplay.textContent = 'black';

  }
}

function reverseIds() {
  const allSquares = document.querySelectorAll(".square");

}