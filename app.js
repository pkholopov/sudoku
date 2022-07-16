const cells = Array.from(document.querySelectorAll('.cell'))
const sudoku = document.querySelector('.sudoku')

const elementsMatrix = getElementsMatrix()

let matrix = getMatrix()

// const line = '85-31-------6--1--1-62---4---29543-8541----7-38976-5-4-185-34-7-371-6-----548--31'

// getSudokuFromLine(line)

function getSudokuFromLine(line) {
    line.split('').forEach((symbol, i) => symbol === '-' ? cells[i].value = '' : cells[i].value = symbol)
}

function getMatrix() {
    let matrix = []
    let i = 0
    for (let y = 0; y < 9; y++) {
        matrix[y] = []
        for (let x = 0; x < 9; x++) {
            matrix[y].push(Number(cells[i].value))
            i++
        }
    }
    return matrix
}

function getElementsMatrix() {
    let matrix = []
    let i = 0
    for (let y = 0; y < 9; y++) {
        matrix[y] = []
        for (let x = 0; x < 9; x++) {
            matrix[y].push(cells[i])
            i++
        }
    }
    return matrix
}

function colorizeBlocks() {
    let n = 0
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (!(n % 2)) {
                getBlock(elementsMatrix, i * 3, j * 3).forEach(e => e.style.backgroundColor = 'rgba(127, 127, 127, 0.15)')
            }
            n++
        }
    }
}

colorizeBlocks()

function getRow(matrix, x) {
    let row = []
    for (i = 0; i < matrix.length; i++) {
        row.push(matrix[x][i])
    }

    return row
}

function getCol(matrix, y) {
    let col = []
    for (i = 0; i < matrix.length; i++) {
        col.push(matrix[i][y])
    }

    return col
}

function getBlock(matrix, x, y) {
    let block = [],
        blockStartX = Math.floor(x / 3) * 3,
        blockStartY = Math.floor(y / 3) * 3
    for (let i = blockStartX; i < blockStartX + 3; i++) {
        for (let j = blockStartY; j < blockStartY + 3; j++) {
            block.push(matrix[i][j])
        }
    }

    return block
}

function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function solve(ms) {
    await pause(ms)
    if (matrix.flat().includes(0)) {
        for (let x = 0; x < matrix.length; x++) {
            for (let y = 0; y < matrix.length; y++) {
                if (!matrix[x][y]) {
                    for (let i = 1; i < 10; i++) {
                        if (!(getRow(matrix, x).includes(i) || getCol(matrix, y).includes(i) || getBlock(matrix, x, y).includes(i))) {
                            matrix[x][y] = i
                            elementsMatrix[x][y].value = i
                            // elementsMatrix[x][y].style.backgroundColor = 'lightgray' //окрашивание подобранных ячеек
                            if (await solve(ms)) {

                                return true
                            }
                            matrix[x][y] = 0
                            elementsMatrix[x][y].value = ''
                        }
                    }

                    return false
                }
            }
        }
    }

    return true
}

cells.forEach(cell => {
    cell.addEventListener('mouseover', (e) => e.target.style.borderColor = 'rgba(255, 0, 0, 0.5)')
    cell.addEventListener('mouseout', (e) => e.target.style.borderColor = null)
})

document.querySelector('.solve').addEventListener('click', () => {
    matrix = getMatrix()
    solve(10)
})