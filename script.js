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

function bestspot(){
    return emptysq()[0];
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



