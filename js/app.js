//#: Selezione degli elementi del DOM
const gameBoard = document.querySelector("#gameboard"); // Scacchiera
const playerDisplay = document.querySelector("#player"); // Giocatore corrente
const infoDisplay = document.querySelector("#info-display"); // Info aggiuntive

const width = 8; // Larghezza della scacchiera (8 caselle)

let playerGo = 'black'; // Turno iniziale del nero
playerDisplay.textContent = 'black'; // Visualizza "black"

//#: Disposizione iniziale dei pezzi sulla scacchiera
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

//#: Crea la scacchiera
function createBoard() {
  gameBoard.innerHTML = ''; // Pulisce la scacchiera
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

    // Riassegna gli event listeners per il drag-and-drop
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach(square => {
      square.addEventListener('dragstart', dragStart);
      square.addEventListener('dragover', dragOver);
      square.addEventListener('drop', dragDrop);
    });
  });
}

createBoard(); // Crea la scacchiera all'avvio

// Funzione per resettare la scacchiera
function resetBoard() {
  createBoard(); // Ricrea la scacchiera

  // Ripristina il turno iniziale
  playerGo = 'black'; // Imposta il turno su "black"
  playerDisplay.textContent = 'black'; // Aggiorna l'elemento della visualizzazione del turno
  infoDisplay.textContent = ''; // Pulisce eventuali messaggi informativi
}

// Event listeners per i bottoni
document.getElementById('reset-btn').addEventListener('click', resetBoard);

//#: funzione per mostrare messaggio errore
function showMessage(message) {
  const infoDisplay = document.getElementById('info-display');
  infoDisplay.textContent = message;
  infoDisplay.classList.add('show');

  setTimeout(() => {
    infoDisplay.classList.remove('show');
  }, 2000);
}


// #: Event listener per il drag and drop
const allSquares = document.querySelectorAll('.square');
allSquares.forEach(square => {
  square.addEventListener('dragstart', dragStart);
  square.addEventListener('dragover', dragOver);
  square.addEventListener('drop', dragDrop);
});

let startPositionId; // Posizione iniziale del pezzo trascinato
let draggedElement; // Elemento trascinato

//#: Inizio del trascinamento
function dragStart(e) {
  startPositionId = e.target.parentNode.getAttribute('square-id');
  draggedElement = e.target;
}

//#: Trascinamento sopra una casella
function dragOver(e) {
  e.preventDefault();
}

//#: Rilascio del pezzo trascinato
function dragDrop(e) {
  e.stopPropagation();

  const pieceColor = draggedElement.firstChild.classList.contains('white') ? 'white' : 'black'; // Determina il colore del pezzo trascinato
  const correctGo = draggedElement.firstChild.classList.contains(playerGo); // Verifica se il pezzo appartiene al giocatore attivo
  const taken = e.target.classList.contains('piece'); // Verifica se la casella contiene già un pezzo
  const valid = checkIfValid(e.target); // Verifica se il movimento è valido
  const opponentGo = playerGo === 'white' ? 'black' : 'white'; // Determina il colore dell'avversario
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo); // Verifica se la casella è occupata da un pezzo avversario

  // Quando il giocatore sbaglia turno, usa showMessage per mostrare l'avviso
  if (!correctGo) {
    showMessage("Non è il tuo turno!");
    return;
  }

  if (takenByOpponent && valid) { // Se la casella è occupata dall'avversario e il movimento è valido
    e.target.parentNode.append(draggedElement); // Sposta il pezzo trascinato nella nuova posizione
    e.target.remove(); // Rimuove il pezzo avversario
    checkForWin(); // controllo vittoria
    changeplayer(); // Cambia il turno del giocatore
    return;
  }

  if (taken && !takenByOpponent) { // Se la casella è occupata dal proprio pezzo
    showMessage("Non puoi muoverti lì!")
    return;
  }

  if (valid) { // Se il movimento è valido e la casella è vuota
    e.target.append(draggedElement); // Sposta il pezzo trascinato nella nuova posizione
    checkForWin(); // controllo vittoria
    changeplayer(); // Cambia il turno del giocatore
    return;
  }

  // Se la mossa non è valida, non cambiare turno
  showMessage("Mossa non valida!")
}

//#: Cambia il turno del giocatore
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

//#: Inverte gli ID delle caselle
function reverseIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) =>
    square.setAttribute('square-id', (width * width - 1) - i)
  );
}

//#: Ripristina gli ID originali delle caselle
function revertIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) =>
    square.setAttribute('square-id', i)
  );
}



//#: Funzione per verificare se il movimento del pezzo è valido
function checkIfValid(target) {
  // Ottieni l'ID della casella di destinazione (dal target o dal suo nodo padre)
  const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));

  // Ottieni l'ID della casella di partenza
  const startId = Number(startPositionId);

  // Ottieni l'ID del pezzo trascinato
  const piece = draggedElement.id;
  const pieceColor = draggedElement.firstChild.classList.contains('white') ? 'white' : 'black'; // Determina il colore del pezzo trascinato

  // Stampa i dettagli nel console log per il debug
  console.log('startId', startId);
  console.log('targetId', targetId);
  console.log('piece', piece);
  console.log('pieceColor', pieceColor);

  // Verifica la validità del movimento in base al tipo di pezzo
  switch (piece) {
    //#: pawn
    case 'pawn': {
      // Righe di partenza dei pedoni neri
      const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];

      // Condizioni per un movimento valido del pedone
      const isMovingForward = startId + width === targetId;
      const isInitialMove = starterRow.includes(startId) && startId + width * 2 === targetId;
      const isCapturing =
        (startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width - 1}"]`)?.firstChild) ||
        (startId + width + 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`)?.firstChild);

      if (
        (isInitialMove || isMovingForward) && !document.querySelector(`[square-id="${targetId}"]`)?.firstChild ||
        isCapturing
      ) {
        return true;
      }
      break;
    }


    //#: knight
    case 'knight': {
      // Funzione di supporto per verificare se una mossa del cavallo è valida
      const isKnightMove = (start, target) => {
        // Possibili movimenti del cavallo in una scacchiera
        const knightMoves = [
          width * 2 + 1,
          width * 2 - 1,
          2 + width,
          -2 + width,
          -(width * 2) + 1,
          -(width * 2) - 1,
          -2 - width,
          2 - width
        ];

        // Controlla se il movimento è tra quelli validi
        return knightMoves.some(move => start + move === target);
      };

      // Verifica se la mossa è valida
      if (isKnightMove(startId, targetId)) {
        // Verifica se la casella di destinazione è vuota o contiene un pezzo avversario
        const targetSquare = document.querySelector(`[square-id="${targetId}"]`);
        if (!targetSquare || !targetSquare.firstChild || targetSquare.firstChild.getAttribute('color') !== pieceColor) {
          return true;
        }
      }
      break;
    }

    //#: bishop
    case 'bishop': {
      // Funzione di supporto per verificare se una mossa diagonale è valida
      const isDiagonalMove = (start, target, step) => {
        // Itera attraverso le caselle lungo la diagonale
        for (let i = 1; i < width; i++) {
          // Calcola l'ID della prossima casella lungo la diagonale
          const nextSquareId = start + i * step;
          // Se la prossima casella è la destinazione, la mossa è valida
          if (nextSquareId === target) {
            return true;
          }
          // Se la casella successiva non esiste o è occupata, interrompi il ciclo
          const nextSquare = document.querySelector(`[square-id="${nextSquareId}"]`);
          if (!nextSquare || nextSquare.firstChild) {
            return false;
          }
        }
        return false;
      };

      // Array dei possibili passi per le quattro direzioni diagonali
      const diagonalSteps = [
        width + 1,   // Diagonale avanti a destra
        width - 1,   // Diagonale avanti a sinistra
        -(width + 1), // Diagonale indietro a sinistra
        -(width - 1)  // Diagonale indietro a destra
      ];

      // Itera attraverso ogni direzione diagonale
      for (const step of diagonalSteps) {
        // Controlla se la mossa diagonale è valida per la direzione corrente
        if (isDiagonalMove(startId, targetId, step)) {
          return true;
        }
      }
      break;
    }
    //#: rook
    case 'rook': {
      // Funzione di supporto per verificare se una mossa rettilinea è valida
      const isStraightMove = (start, target, step) => {
        // Itera attraverso le caselle lungo la linea retta
        for (let i = 1; i < width; i++) {
          // Calcola l'ID della prossima casella lungo la linea retta
          const nextSquareId = start + i * step;
          // Se la prossima casella è la destinazione, la mossa è valida
          if (nextSquareId === target) {
            return true;
          }
          // Se la casella successiva non esiste o è occupata, interrompi il ciclo
          const nextSquare = document.querySelector(`[square-id="${nextSquareId}"]`);
          if (!nextSquare || nextSquare.firstChild) {
            return false;
          }
        }
        return false;
      };

      // Array dei possibili passi per le quattro direzioni rettilinee
      const straightSteps = [
        width,   // Verticale verso il basso
        -width,  // Verticale verso l'alto
        1,       // Orizzontale verso destra
        -1       // Orizzontale verso sinistra
      ];

      // Itera attraverso ogni direzione rettilinea
      for (const step of straightSteps) {
        // Controlla se la mossa rettilinea è valida per la direzione corrente
        if (isStraightMove(startId, targetId, step)) {
          return true;
        }
      }
      break;

    }
    //#: queen
    case 'queen': {
      // Funzione di supporto per verificare se una mossa diagonale è valida
      const isDiagonalMove = (start, target, step) => {
        for (let i = 1; i < width; i++) {
          const nextSquareId = start + i * step;
          if (nextSquareId === target) {
            return true;
          }
          const nextSquare = document.querySelector(`[square-id="${nextSquareId}"]`);
          if (!nextSquare || nextSquare.firstChild) {
            return false;
          }
        }
        return false;
      };

      // Funzione di supporto per verificare se una mossa rettilinea è valida
      const isStraightMove = (start, target, step) => {
        for (let i = 1; i < width; i++) {
          const nextSquareId = start + i * step;
          if (nextSquareId === target) {
            return true;
          }
          const nextSquare = document.querySelector(`[square-id="${nextSquareId}"]`);
          if (!nextSquare || nextSquare.firstChild) {
            return false;
          }
        }
        return false;
      };

      // Array dei possibili passi per le quattro direzioni diagonali
      const diagonalSteps = [
        width + 1,    // Diagonale avanti a destra
        width - 1,    // Diagonale avanti a sinistra
        -(width + 1), // Diagonale indietro a sinistra
        -(width - 1)  // Diagonale indietro a destra
      ];

      // Array dei possibili passi per le quattro direzioni rettilinee
      const straightSteps = [
        width,   // Verticale verso il basso
        -width,  // Verticale verso l'alto
        1,       // Orizzontale verso destra
        -1       // Orizzontale verso sinistra
      ];

      // Itera attraverso ogni direzione diagonale
      for (const step of diagonalSteps) {
        if (isDiagonalMove(startId, targetId, step)) {
          return true;
        }
      }

      // Itera attraverso ogni direzione rettilinea
      for (const step of straightSteps) {
        if (isStraightMove(startId, targetId, step)) {
          return true;
        }
      }

      break;
    }
    //#: king
    case 'king': {
      // Funzione di supporto per verificare se una mossa del re è valida
      const isKingMove = (start, target) => {
        // Calcola la differenza di posizione tra la casella di partenza e quella di destinazione
        const rowDiff = Math.abs(Math.floor(start / width) - Math.floor(target / width));
        const colDiff = Math.abs((start % width) - (target % width));

        // Il re può muoversi di una casella in qualsiasi direzione
        return (rowDiff <= 1 && colDiff <= 1);
      };

      // Verifica se la mossa è valida
      if (isKingMove(startId, targetId)) {
        // Verifica se la casella di destinazione è vuota o contiene un pezzo avversario
        const targetSquare = document.querySelector(`[square-id="${targetId}"]`);
        if (!targetSquare || !targetSquare.firstChild || targetSquare.firstChild.getAttribute('color') !== pieceColor) {
          return true;
        }
      }
      break;
    }

  }

  // Ritorna false se il movimento non è valido
  return false;
}

//#: funzione per il controllo della vittoria
function checkForWin() {
  // Trova tutti gli elementi con l'ID 'king' (potrebbero essere 0, 1 o 2)
  const kings = Array.from(document.querySelectorAll('[id^="king"]'));

  // Debug: stampa l'elenco dei re trovati
  console.log(kings);

  // Controlla il numero di re trovati
  if (kings.length < 2) {
    // Determina il colore del re mancante
    const whiteKing = kings.find(king => king.classList.contains('white'));
    const blackKing = kings.find(king => king.classList.contains('black'));

    if (!whiteKing) {
      // Il re bianco è stato catturato, i neri vincono
      console.log("Black wins!");
      alert("Black wins!");
    } else if (!blackKing) {
      // Il re nero è stato catturato, i bianchi vincono
      console.log("White wins!");
      alert("White wins!");
    }
  } else {
    // Entrambi i re sono ancora in gioco
    console.log("Game continues, both kings are present.");
  }
}

