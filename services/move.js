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

// Check neighbours of a location at board and tell me what they contain
const checkSurroundings = (board, position) => {

   let up = board[position.y - 1  + Offset][position.x  + Offset];
   let right = board[position.y  + Offset][position.x + 1  + Offset];
   let down = board[position.y + 1  + Offset][position.x  + Offset];
   let left = board[position.y  + Offset][position.x - 1  + Offset];

   let neighbours = [up,right,down,left]
   return neighbours;
}

const GetPositionOfNeighbours = position => {
    let up = [(position[0] - 1), position[1]];
    let right = [position[0], (position[1] + 1)];
    let down = [(position[0] + 1), position[1]];
    let left = [position[0], (position[1] - 1)];
 
    let neighbours = [up,right,down,left]
    return neighbours;
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

const getContentOfCell = (board, position) => {
    return board[position[0] + Offset][position[1] + Offset]
}

const exploreFrontier = (board, startPosition) => {
    let frontier = new Array();
    frontier.push(startPosition);
    let cameFrom = [{Position: startPosition, Direction: "None"}];

    while (frontier){
        console.log("FRONTIER", frontier);
        // let current = frontier.shift();
        let current = frontier[0];
        frontier.splice(0,1);
        let neighbours = GetPositionOfNeighbours(current);
        // Push all neighbours we DIDNT come from into frontier
        neighbours.forEach(neighbour => {
           if(!hasVisitedNeighbour(cameFrom, neighbour)){
               if(isCellNonLethal(board, neighbour)){
                   // Interesting neighbour, need to investigate further
                   if (!alreadyInList(neighbour, frontier)){
                        frontier.push(neighbour);
                   }
               }
           }
            // Where did i come from?
            let direction = getDirectionFromNeighbouringPoint(current, neighbour);
            cameFrom.push({Position: neighbour, Direction: direction});
        })
    }
}

const alreadyInList = (element, list) => {
    list.forEach(item => {
        if((item[0] == element[0]) && (item[1] == element[1]))
            return true;
    })
    return false;
}

const hasVisitedNeighbour = (cameFrom, neighbour) => {   
    cameFrom.forEach(visited => {
        if((visited.Position[0] == neighbour[0]) && (visited.Position[1] == neighbour[1]))
            return true;
    })
    return false;
}
const isCellNonLethal = (board, position) => {
    let cellContent = getContentOfCell(board, position);
    if(cellContent == 0 || cellContent == 1)
        return true;
    else
        return false;
}

const getDirectionFromNeighbouringPoint = (current, neighbour) => {
    let up = [current[0] - 1, current[1]];
    let right = [current[0], current[1] + 1];
    let down = [current[0] + 1, current[1]];
    let left = [current[0], current[1] - 1];

    var directions = [up, right, down, left];

    for (i = 0; i < 4; i++){
        if (neighbour[0] == directions[i][0] && neighbour[1] == directions[i][1]){
            switch (i) {
                case 0:
                return "up"
                case 1:
                return "right"
                case 2:
                return "down"
                case 3:
                return "left"
            }
        }
    }
    return "None";
}

const generateMove = request => {
    let board = createBoard(request.body.board.width, request.body.board.height);
    fillBoardWithFood(board, request.body.board.food);
    fillBoardWithSnakes(board, request.body.board.snakes);
    fillBoardWithOwnSnake(board, request.body.you);

    let surroundings = checkSurroundings(board, request.body.you.body[0]);
    console.log(surroundings);

    // Start doing some sick exploring if there's food on the map, bro... or else just survive

    if(request.body.board.food.length) {
        console.log("Found food, exploring")
        exploreFrontier(board, [request.body.you.body[0].y, request.body.you.body[0].x]);
    }

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