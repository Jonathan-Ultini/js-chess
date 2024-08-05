// Selezione degli elementi del DOM
const gameBoard = document.querySelector("#gameboard"); // Seleziona l'elemento con id "gameboard" che rappresenta la scacchiera
const playerDisplay = document.querySelector("#player"); // Seleziona l'elemento con id "player" che mostra il giocatore corrente
const infoDisplay = document.querySelector("#info-display"); // Seleziona l'elemento con id "info-display" per mostrare informazioni aggiuntive

const width = 8; // Larghezza della scacchiera (8 caselle)

let playerGo = 'black'; // Inizializza il turno del giocatore al nero
playerDisplay.textContent = 'black'; // Imposta il testo dell'elemento playerDisplay su "black"

// Array con la disposizione iniziale dei pezzi sulla scacchiera
const startPieces = [
  rook, knight, bishop, queen, king, bishop, knight, rook, // Pezzi della prima riga (nero)
  pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, // Pedoni della seconda riga (nero)
  '', '', '', '', '', '', '', '', // Righe vuote nel mezzo
  '', '', '', '', '', '', '', '', // Righe vuote nel mezzo
  '', '', '', '', '', '', '', '', // Righe vuote nel mezzo
  '', '', '', '', '', '', '', '', // Righe vuote nel mezzo
  pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, // Pedoni della settima riga (bianco)
  rook, knight, bishop, queen, king, bishop, knight, rook // Pezzi dell'ottava riga (bianco)
];

// Funzione per creare la scacchiera
function createBoard() {
  startPieces.forEach((startPiece, i) => { // Itera su ogni pezzo nella disposizione iniziale
    const square = document.createElement('div'); // Crea un nuovo div per la casella
    square.classList.add('square'); // Aggiunge la classe "square" alla casella
    square.innerHTML = startPiece; // Inserisce il pezzo nella casella (HTML)
    square.firstChild && square.firstChild.setAttribute('draggable', true); // Rende il pezzo trascinabile se esiste
    square.setAttribute('square-id', i); // Imposta un attributo con l'indice della casella

    // Determina il colore della casella basandosi sulla posizione
    const row = Math.floor((63 - i) / 8) + 1; // Calcola la riga della casella
    if (row % 2 === 0) { // Se la riga è pari
      square.classList.add(i % 2 === 0 ? "beige" : "brown"); // Alterna i colori delle caselle (beige/marrone)
    } else { // Se la riga è dispari
      square.classList.add(i % 2 === 0 ? "brown" : "beige"); // Alterna i colori delle caselle (marrone/beige)
    }

    // Imposta il colore del pezzo in base alla posizione iniziale
    if (i <= 15) { // Prime due righe (pezzi neri)
      square.firstChild.firstChild.classList.add('black');
    }
    if (i >= 48) { // Ultime due righe (pezzi bianchi)
      square.firstChild.firstChild.classList.add('white');
    }

    // Aggiunge la casella alla scacchiera
    gameBoard.append(square);
  });
}

// Crea la scacchiera all'avvio
createBoard();

// Seleziona tutte le caselle della scacchiera
const allSquare = document.querySelectorAll('.square');

// Aggiunge gli event listener per il drag and drop a ogni casella
allSquare.forEach(square => {
  square.addEventListener('dragstart', dragStart); // Inizia il trascinamento
  square.addEventListener('dragover', dragOver); // Trascinamento sopra una casella
  square.addEventListener('drop', dragDrop); // Rilascio su una casella
});

// Variabili per tenere traccia della posizione iniziale e dell'elemento trascinato
let startPositionId;
let draggedElement;

// Funzione per gestire l'inizio del trascinamento
function dragStart(e) {
  startPositionId = e.target.parentNode.getAttribute('square-id'); // Salva l'ID della posizione iniziale
  draggedElement = e.target; // Salva l'elemento trascinato
}

// Funzione per gestire il trascinamento sopra una casella
function dragOver(e) {
  e.preventDefault(); // Previene l'azione predefinita per permettere il drop
}

// Funzione per gestire il rilascio dell'elemento trascinato
function dragDrop(e) {
  e.stopPropagation(); // Impedisce la propagazione dell'evento
  console.log(e.target); // Stampa nel console log l'elemento target dell'evento

  // Controlla se l'elemento target ha la classe 'piece', indicando che è un pezzo degli scacchi
  const taken = e.target.classList.contains('piece');

  // Sposta l'elemento trascinato (draggedElement) nel nodo padre del target
  e.target.parentNode.append(draggedElement);

  // Aggiunge l'elemento trascinato (draggedElement) all'elemento target
  e.target.append(draggedElement);

  // Rimuove l'elemento target (se è un pezzo preso)
  e.target.remove();

  // Cambia il giocatore attivo
  changeplayer();
}

// Funzione per cambiare il turno del giocatore
function changeplayer() {
  if (playerGo === "black") { // Se il turno attuale è del nero
    playerGo = "white"; // Cambia al bianco
    playerDisplay.textContent = 'white'; // Aggiorna il display
  } else { // Se il turno attuale è del bianco
    playerGo = "black"; // Cambia al nero
    playerDisplay.textContent = 'black'; // Aggiorna il display
  }
}

// Funzione dichiarata ma non implementata
function reverseIds() {
  const allSquares = document.querySelectorAll(".square"); // Seleziona tutte le caselle della scacchiera
}
