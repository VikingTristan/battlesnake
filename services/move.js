// Eventually other services here

const createBoard = (height, width) => {
    let arr = [];

    // Instantiate board of width x height size with padding 1
    for(i = 0; i < width+2; i++){
        arr.push(new Array(height+2));
    }

    // Fill all cells with 0
    for(i = 0; i < width+2; i++){
        for (j = 0; j < height+2; j++){
            arr[i][j] = 0;
        }
    }

    // Fill the outer edges with -1
    for(i = 0; i < width+2; i++){
        arr[0][i] = -1;
        arr[i][0] = -1;

        arr[width+1][i] = -1;
        arr[i][width+1] = -1;
    }

    return arr;
}

const fillBoardWithFood = (board, foodArray) => {
    foodArray.forEach(food => {
        board[food.y+1][food.x+1] = 1;
    });
}

const fillBoardWithSnakes = (board, snakes) => {
    snakes.forEach(snake => {
        snake.body.forEach(body => {
            board[body.y+1][body.x+1] = 2;
        })
    });
}

const fillBoardWithOwnSnake = (board, ownSnake) => {
    ownSnake.body.forEach(body => {
        board[body.y+1][body.x+1] = 3;
    });
}

const generateMove = request => {
    let nextMove = "right";

    let board = createBoard(request.body.board.width, request.body.board.height);
    fillBoardWithFood(board, request.body.board.food);
    fillBoardWithSnakes(board, request.body.board.snakes);
    fillBoardWithOwnSnake(board, request.body.you);
    // Do not walk into a wall...
    console.log(board);
    
    
    // Snake move logic here?



    return nextMove;
}

module.exports = {
    generateMove
}