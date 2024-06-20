document.getElementById('empieza').addEventListener('click', empezarJuego);
document.getElementById('obstaculos').addEventListener('click', ocultarObstaculos);

let map = [];
let robotPosition = { x: 0, y: 0 };
let direction = 'right';
let obstaclesVisible = false;

function empezarJuego() {
    const mapInput = document.getElementById('map-input').value;
    const [mapData, legendData] = mapInput.split('\n\n');
    map = mapData.split('\n').map(row => row.split(''));
    const legend = legendData.split('\n').reduce((acc, line) => {
        const [key, value] = line.split(':');
        acc[key] = value;
        return acc;
    }, {});

    crearMapa(legend);
    document.getElementById('obstaculos').style.display = 'block';
    document.addEventListener('keydown', presionarFunction);
}

function crearMapa(legend) {
    const board = document.getElementById('game-board');
    board.innerHTML = '';

    map.forEach((row, y) => {
        row.forEach((cellType, x) => {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'hidden');

            if (cellType === 'I') {
                cell.classList.add('yellow');
                robotPosition = { x, y };
                cell.id = 'robot';
            } else if (cellType === 'F') {
                cell.classList.add('green');
            } else if (cellType === 'A') {
                cell.classList.add('black');
            } else if (cellType === 'O') {
                cell.classList.add('blue');
            } else if (['S', 'C', 'P'].includes(cellType)) {
                cell.classList.add('monster');
                cell.style.backgroundImage = `url('${legend[cellType].split(' ')[0]}')`;
            }

            board.appendChild(cell);
        });
    });
}

const cellActions = {
    'O': (newPos) => actualizarPosicion(newPos),
    'F': (newPos) => {
        actualizarPosicion(newPos);
        alert("El robot está durmiendo en sociales");
    },
    'S': (newPos, dir) => handleSuplantacion(newPos, dir),
    'C': (newPos, dir) => handleCopia(newPos, dir),
    'P': (newPos) => handlePlagio(newPos),
    'A': (newPos) => handleAgujeroNegro(newPos)
};

function crearCeldasFunction(cell, newPos, dir) {
    const action = cellActions[cell];
    if (action) {
        action(newPos, dir);
    }
}

function ocultarObstaculos() {

    obstaclesVisible = !obstaclesVisible;


    const cells = document.querySelectorAll('.monster, .black');


    cells.forEach(cell => {
        if (obstaclesVisible) {
            cell.classList.remove('hidden');
        } else {
            cell.classList.add('hidden');
        }
    });


    const button = document.getElementById('obstaculos');
    button.textContent = obstaclesVisible ? 'Ocultar obstáculos' : 'Mostrar obstáculos';
}

function presionarFunction(event) {
    const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (!directions.includes(event.key)) return;

    const direction = event.key.replace('Arrow', '').toLowerCase();
    movimientoRobot(direction);
}

function movimientoRobot(dir) {
    const newPos = { ...robotPosition };
    if (dir === 'up') newPos.y -= 1;
    if (dir === 'down') newPos.y += 1;
    if (dir === 'left') newPos.x -= 1;
    if (dir === 'right') newPos.x += 1;

    if (newPos.x < 0 || newPos.x >= map[0].length || newPos.y < 0 || newPos.y >= map.length) return;

    const nextCell = map[newPos.y][newPos.x];
    crearCeldasFunction(nextCell, newPos, dir);
}

function actualizarPosicion(newPos) {
    const oldRobotCell = document.getElementById('robot');
    if (oldRobotCell) {
        oldRobotCell.id = '';
    }

    robotPosition = newPos;

    const newRobotCellIndex = newPos.y * 11 + newPos.x + 1;
    const newRobotCell = document.querySelector(`#game-board .cell:nth-child(${newRobotCellIndex})`);
    if (newRobotCell) {
        newRobotCell.id = 'robot';
    }
}
