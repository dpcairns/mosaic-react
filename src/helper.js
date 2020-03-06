const maxRows = 6;
const maxColumns = 11;


export function getInitGameState() {
    let gameState = [];

    for (let i = 0; i < maxRows; i++) {
        //make new array for every row in grid array
        gameState.push([]);
        //make null placeholder for each cell in grid
        for (let j = 0; j < maxColumns; j++) {
            if (j % 2 === 0) {
                gameState[i].push('rgba(140, 140, 140, 0.2)');
            } else {
                gameState[i].push('rgba(120, 120, 120, 0.2)')
            }
        }
    } 
    return gameState
}

export function getInitPlaybackState() {
    let gameState = [];

    for (let i = 0; i < maxRows; i++) {
        //make new array for every row in grid array
        gameState.push([]);
        //make null placeholder for each cell in grid
        for (let j = 0; j < maxColumns; j++) {
            if (j % 2 === 0) {
                gameState[i].push('rgba(0, 0, 0, 0)');
            } else {
                gameState[i].push('rgba(0, 0, 0, 0)')
            }
        }
    } 
    return gameState
}