//variables
var board;
const human = 'O';
const comp= 'X';
const winninglayouts= [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
];

const cells= document.querySelectorAll('.cell'); //selects all cell class elements

//fns
startgame();

function startgame(){
    document.querySelector(".endgame").style.display="none";
    board=Array.from(Array(9).keys());
    for (var i =0; i< cells.length ; i++ ){
        cells[i].innerText='';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',turnclick,false);
    }
}

function declare(winner){
    document.querySelector(".endgame").style.display="block";
    document.querySelector(".endgame .text").innerText=winner;
}

function tiechecker(){
    if(emptysq().length ==0){
        for(var i=0;i<cells.length;i++){
            cells[i].style.backgroundColor="green";
            cells[i].removeEventListener('click',turnclick,false)
        }
        declare("Tie !");
        return true
    }
    return false
}

function emptysq(){
    return board.filter(s => typeof s == 'number')
}

function minimax(newboard,player){
    var availsq =emptysq(newboard);
    if(checkwin(newboard,player)){
        return {score: -1};
    }
    else if (checkwin(newboard,comp)){
        return {score: 1};
    }
    else if (availsq.length === 0){
        return {score:0};
    }

    var moves=[];
    for(var i=0;i<availsq.length;i++){
        var move={};
        move.index=newboard[availsq[i]];
        newboard[availsq[i]]=player;

        if(player == comp){
            var result=minimax(newboard,human);
        }
        else{
            var result=minimax(newboard,comp);   
        }
        move.score = result.score;
        newboard[availsq[i]]=move.index;
        moves.push(move)
    }

    var bestmove;
    if(player === comp){
        var bestscore=-10000;
        for(var i=0;i<moves.length;i++){
            if(moves[i].score>bestscore){
                bestscore=moves[i].score;
                bestmove=i;
            }
        }
    }
    else{
        var bestscore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestscore) {
                bestscore = moves[i].score;
                bestmove = i;
            }
        }
    }
    return moves[bestmove];
}

function bestspot(){
    return minimax(board,comp).index;
}

function turnclick(square){
    if(typeof board[square.target.id]=='number'){
        turn(square.target.id, human);
        if (!tiechecker()) turn(bestspot(), comp)
    }
}

function turn(squareID,player){
    board[squareID]=player;
    document.getElementById(squareID).innerText=player;
    let won=checkwin(board,player);
    if (won) gameover(won);
}

function checkwin(board,player){
    let plays=board.reduce((a,e,i) => (e===player)? a.concat(i):a,[]);
    let won=null;
    for(let [index,win] of winninglayouts.entries()) {
        if(win.every(elem => plays.indexOf(elem)>-1)) {
            won={index:index,player:player};
            break;
        }
    }
    return won;
}

function gameover(won) {
    for (let index of winninglayouts[won.index]) {
        document.getElementById(index).style.backgroundColor=
            won.player ==human ? "blue":"red";
    }
    for (var i=0;i<cells.length;i++ ) {
        cells[i].removeEventListener('click',turnclick,false);
    }
    declare(won.player == human ? "You win!" :"You lose!");
}



