// Eventually other services here

const Offset = 1;

const createBoard = (height, width) => {
    let arr = [];

    // Instantiate board of width x height size with padding 1
    for(i = 0; i < width+2; i++){
        arr.push(new Array(height+2));
    }

    // Fill all cells with 0
    for(i = 0; i < (width + (Offset * 2)); i++){
        for (j = 0; j < (height + (Offset*2)); j++){
            arr[i][j] = 0;
        }
    }

    // Fill the outer edges with -1
    for(i = 0; i < (width + (Offset*2)); i++){
        arr[0][i] = -1;
        arr[i][0] = -1;

        arr[width+1][i] = -1;
        arr[i][width+1] = -1;
    }

    return arr;
}

const fillBoardWithFood = (board, foodArray) => {
    foodArray.forEach(food => {
        board[food.y + Offset][food.x + Offset] = 1;
    });
}

const fillBoardWithSnakes = (board, snakes) => {
    snakes.forEach(snake => {
        snake.body.forEach(body => {
            board[body.y + Offset][body.x + Offset] = 2;
        })
    });
}

const fillBoardWithOwnSnake = (board, ownSnake) => {
    ownSnake.body.forEach(body => {
        board[body.y + Offset][body.x + Offset] = 3;
    });
}

// Check surrounds from head location at board and prioritize move accordingly (Prioritize apple over blank space)
const checkSurroundings = (board, head) => {

   let up = board[head.y - 1  + Offset][head.x  + Offset];
   let right = board[head.y  + Offset][head.x + 1  + Offset];
   let down = board[head.y + 1  + Offset][head.x  + Offset];
   let left = board[head.y  + Offset][head.x - 1  + Offset];

   let surroundings = [up,right,down,left]
   return surroundings;
}

// If any of the neigbhouring cells are empty or food, that is a legal move
const GetLegalMoveFromSurroundings = (board, surroundings) => {
    for (i = 0; i < 4; i++){
        if (surroundings[i] == 0 || surroundings[i] == 1){
            switch (i) {
                case 0:
                return "up"
                case 1:
                return "right"
                case 2:
                return "down"
                case 3:
                return "left"
                default:
                return "up"
            }
        }
    }
}

const generateMove = request => {
    let board = createBoard(request.body.board.width, request.body.board.height);
    fillBoardWithFood(board, request.body.board.food);
    fillBoardWithSnakes(board, request.body.board.snakes);
    fillBoardWithOwnSnake(board, request.body.you);

    let surroundings = checkSurroundings(board, request.body.you.body[0]);
    console.log(surroundings);

    let nextMove = GetLegalMoveFromSurroundings(board, surroundings);
    // Do not walk into a wall...
    console.log(nextMove);
    
    //console.log(board);
    
    
    // Snake move logic here?



    return nextMove;
}

module.exports = {
    generateMove
}