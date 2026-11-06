let tableroContainer = document.querySelector('#sudoku-board');
let btnCargarTablero = document.querySelector('#btn-cargar');
let btnLimpiarTablero = document.querySelector('#btn-limpiar');
let btnResolverTablero = document.querySelector('#btn-resolver');

function generarTablero(guardarEnStorage = true) {
    tableroContainer.innerHTML = "";
    let guardado = JSON.parse(localStorage.getItem('sudoku_estado')) || [];

    for (let fila = 0; fila < 9; fila++) {
        for (let col = 0; col < 9; col++) {
            let input = document.createElement('input');
            input.type = 'number';
            input.min = '1';
            input.max = '9';

            input.dataset.row = fila;
            input.dataset.col = col;

            if (fila > 0 && fila % 3 === 0) input.classList.add('border-top-thick');
            if (col > 0 && col % 3 === 0) input.classList.add('border-left-thick');

            if (guardado.length > 0 && guardado[fila][col] !== 0) {
                input.value = guardado[fila][col];
            }

            input.addEventListener('input', () => {
                guardarEstadoLocalStorage();
            });

            tableroContainer.appendChild(input);
        }
    }
    if (guardarEnStorage) guardarEstadoLocalStorage();
}

function guardarEstadoLocalStorage() {
    let matriz = obtenerTableroDesdeDOM();
    localStorage.setItem('sudoku_estado', JSON.stringify(matriz));
}

function obtenerTableroDesdeDOM() {
    let matriz = Array(9).fill(0).map(() => Array(9).fill(0));

    let inputs = document.querySelectorAll('#sudoku-board input');

    inputs.forEach(input => {
        let fila = input.dataset.row;
        let col = input.dataset.col;
        let valor = input.value;

        matriz[fila][col] = valor === "" ? 0 : Number(valor);
    });
    return matriz;
};

function esValido(tablero, fila, col, num) {
    for (let i = 0; i < 9; i++) {
        if (tablero[fila][i] === num) return false;
        if (tablero[i][col] === num) return false;

        let filaBox = Math.floor(fila / 3) * 3 + Math.floor(i / 3);
        let colBox = Math.floor(col / 3) * 3 + (i % 3);
        if (tablero[filaBox][colBox] === num) return false;
    }
    return true;
}

function solveSudoku(tablero) {
    for (let fila = 0; fila < 9; fila++) {
        for (let col = 0; col < 9; col++) {
            if (tablero[fila][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (esValido(tablero, fila, col, num)) {
                        tablero[fila][col] = num;

                        if (solveSudoku(tablero)) {
                            return true;
                        }

                        tablero[fila][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

btnCargarTablero.addEventListener('click', () => {
    generarTablero();
});

btnLimpiarTablero.addEventListener('click', () => {
    let inputs = document.querySelectorAll('#sudoku-board input');
    inputs.forEach(input => {
        input.value = "";
    });
    localStorage.removeItem('sudoku_estado');
});

btnResolverTablero.addEventListener('click', () => {
    let matriz = obtenerTableroDesdeDOM();

    if (solveSudoku(matriz)) {
        let inputs = document.querySelectorAll('#sudoku-board input');
        inputs.forEach(input => {
            let fila = input.dataset.row;
            let col = input.dataset.col;
            input.value = matriz[fila][col];
        });
    } else {
        alert('Este Sudoku no tiene solución válida');
    }
});

generarTablero(false);