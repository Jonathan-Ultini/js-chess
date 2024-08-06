// Selezione degli elementi del DOM
const gameBoard = document.querySelector("#gameboard"); // Scacchiera
const playerDisplay = document.querySelector("#player"); // Giocatore corrente
const infoDisplay = document.querySelector("#info-display"); // Info aggiuntive

const width = 8; // Larghezza della scacchiera (8 caselle)

let playerGo = 'black'; // Turno iniziale del nero
playerDisplay.textContent = 'black'; // Visualizza "black"

// Disposizione iniziale dei pezzi sulla scacchiera
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

// Crea la scacchiera
function createBoard() {
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement('div'); // Crea una casella
    square.classList.add('square'); // Aggiunge la classe "square"
    square.innerHTML = startPiece; // Inserisce il pezzo
    if (square.firstChild) square.firstChild.setAttribute('draggable', true); // Rende il pezzo trascinabile
    square.setAttribute('square-id', i); // Imposta l'ID della casella

    // Determina il colore della casella
    const row = Math.floor((63 - i) / 8) + 1;
    square.classList.add(row % 2 === 0 ? (i % 2 === 0 ? "beige" : "brown") : (i % 2 === 0 ? "brown" : "beige"));

    // Imposta il colore del pezzo
    if (i <= 15) square.firstChild.firstChild.classList.add('black'); // Pezzi neri
    if (i >= 48) square.firstChild.firstChild.classList.add('white'); // Pezzi bianchi

    gameBoard.append(square); // Aggiunge la casella alla scacchiera
  });
}

createBoard(); // Crea la scacchiera all'avvio

// Event listener per il drag and drop
const allSquares = document.querySelectorAll('.square');
allSquares.forEach(square => {
  square.addEventListener('dragstart', dragStart);
  square.addEventListener('dragover', dragOver);
  square.addEventListener('drop', dragDrop);
});

let startPositionId; // Posizione iniziale del pezzo trascinato
let draggedElement; // Elemento trascinato

// Inizio del trascinamento
function dragStart(e) {
  startPositionId = e.target.parentNode.getAttribute('square-id');
  draggedElement = e.target;
}

// Trascinamento sopra una casella
function dragOver(e) {
  e.preventDefault();
}

// Rilascio del pezzo trascinato
function dragDrop(e) {
  e.stopPropagation();

  const correctGo = draggedElement.firstChild.classList.contains(playerGo); // Verifica se il pezzo appartiene al giocatore attivo
  const taken = e.target.classList.contains('piece'); // Verifica se la casella contiene già un pezzo
  const valid = checkIfValid(e.target); // Verifica se il movimento è valido
  const opponentGo = playerGo === 'white' ? 'black' : 'white'; // Determina il colore dell'avversario
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo); // Verifica se la casella è occupata da un pezzo avversario

  if (correctGo) { // Se il pezzo appartiene al giocatore attivo
    if (takenByOpponent && valid) { // Se la casella è occupata dall'avversario e il movimento è valido
      e.target.parentNode.append(draggedElement); // Sposta il pezzo trascinato nella nuova posizione
      e.target.remove(); // Rimuove il pezzo avversario
      changeplayer(); // Cambia il turno del giocatore
      return;
    }
    if (taken && takenByOpponent) { // Se la casella è occupata dall'avversario ma il movimento non è valido
      infoDisplay.textContent = "Non puoi muoverti lì"; // Mostra un messaggio di errore
      setTimeout(() => infoDisplay.textContent = "", 2000); // Rimuove il messaggio dopo 2 secondi
      return;
    }
    if (valid) { // Se il movimento è valido e la casella è vuota
      e.target.append(draggedElement); // Sposta il pezzo trascinato nella nuova posizione
      changeplayer(); // Cambia il turno del giocatore
      return;
    }
  }

  changeplayer(); // Cambia il turno del giocatore (default)
}


// Cambia il turno del giocatore
function changeplayer() {
  if (playerGo === "black") {
    reverseIds(); // Inverte gli ID delle caselle
    playerGo = "white";
    playerDisplay.textContent = 'white';
  } else {
    revertIds(); // Ripristina gli ID originali delle caselle
    playerGo = "black";
    playerDisplay.textContent = 'black';
  }
}

// Inverte gli ID delle caselle
function reverseIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) =>
    square.setAttribute('square-id', (width * width - 1) - i)
  );
}

// Ripristina gli ID originali delle caselle
function revertIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) =>
    square.setAttribute('square-id', i)
  );
}


// Funzione per verificare se il movimento del pezzo è valido
function checkIfValid(target) {
  // Ottieni l'ID della casella di destinazione (dal target o dal suo nodo padre)
  const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));

  // Ottieni l'ID della casella di partenza
  const startId = Number(startPositionId);

  // Ottieni l'ID del pezzo trascinato
  const piece = draggedElement.id;

  // Stampa i dettagli nel console log per il debug
  console.log('startId', startId);
  console.log('targetId', targetId);
  console.log('piece', piece);
}
