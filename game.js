// Configuración de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
    // Tus credenciales de Firebase
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let player1 = {name: '', number: '', guess: ''};
let player2 = {name: '', number: '', guess: ''};
let currentPlayer = 1;
let gameStarted = false;

function startGame() {
    player1.name = document.getElementById('name1').value;
    player1.number = document.getElementById('number1').value;
    player2.name = document.getElementById('name2').value;
    player2.number = document.getElementById('number2').value;

    if (!validateNumber(player1.number) || !validateNumber(player2.number)) {
        alert('Los números deben ser de 4 dígitos y no pueden tener más de dos dígitos repetidos.');
        return;
    }

    set(ref(db, 'game/player1'), player1);
    set(ref(db, 'game/player2'), player2);

    document.getElementById('gameArea').style.display = 'block';
    gameStarted = true;
    updateTurnIndicator();
}

function validateNumber(number) {
    if (number.length !== 4) return false;
    let digitCounts = {};
    for (let digit of number) {
        digitCounts[digit] = (digitCounts[digit] || 0) + 1;
        if (digitCounts[digit] > 2) return false;
    }
    return true;
}

function updateTurnIndicator() {
    const turnIndicator = document.getElementById('turnIndicator');
    turnIndicator.textContent = `Turno de: ${currentPlayer === 1 ? player1.name : player2.name}`;
}

function makeGuess() {
    const guess = document.getElementById('guess').value;
    if (guess.length !== 4) {
        alert('La adivinanza debe ser un número de 4 dígitos.');
        return;
    }

    if (currentPlayer === 1) {
        player1.guess = guess;
        checkGuess(player1.guess, player2.number);
        set(ref(db, 'game/player1/guess'), guess);
        currentPlayer = 2;
    } else {
        player2.guess = guess;
        checkGuess(player2.guess, player1.number);
        set(ref(db, 'game/player2/guess'), guess);
        currentPlayer = 1;
    }
    updateTurnIndicator();
}

function checkGuess(guess, actualNumber) {
    let correctDigits = 0;
    let correctPositions = 0;
    for (let i = 0; i < 4; i++) {
        if (guess[i] === actualNumber[i]) {
            correctPositions++;
        } else if (actualNumber.includes(guess[i])) {
            correctDigits++;
        }
    }
    document.getElementById('result').textContent = `Aciertos: ${correctDigits}, Posiciones Correctas: ${correctPositions}`;
}

// Firebase Authentication Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('game').style.display = 'block';
        // Escuchar cambios en la base de datos
        onValue(ref(db, 'game'), (snapshot) => {
            const data = snapshot.val();
            if (data && gameStarted) {
                player1 = data.player1;
                player2 = data.player2;
                updateTurnIndicator();
            }
        });
    } else {
        document.getElementById('game').style.display = 'none';
    }
});
