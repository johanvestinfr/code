//@www.kaaru13.de
var images = new Array(4);
var tom = 0;
var maru = 1;
var batsu = 2;
var size = 3;
var user = new Array(2);
var comp = new Array(2);
var selectedValue = 0;

var emptySrcset = "/img/tictactoe/square_xs.png 300w, img/tictactoe/square_s.png 600w, img/tictactoe/square_m.png 800w";

var emptyHoverSrcset = "/img/tictactoe/square_hover_xs.png 300w, img/tictactoe/square_hover_s.png 600w, img/tictactoe/square_hover_m.png 800w";

user[0] = "/img/tictactoe/maru_xs.png 300w, /img/tictactoe/maru_s.png 600w, /img/tictactoe/maru_m.png 800w";

user[1] = "/img/tictactoe/plus_xs.png 300w, /img/tictactoe/plus_s.png 600w, /img/tictactoe/plus_m.png 800w";

comp[0] = "/img/tictactoe/batsu_xs.png 300w, /img/tictactoe/batsu_s.png 600w, /img/tictactoe/batsu_m.png 800w";

comp[1] = "/img/tictactoe/minus_xs.png 300w, /img/tictactoe/minus_s.png 600w, /img/tictactoe/minus_m.png 800w";

function squareClicked(id) {

selectedValue = document.getElementById("symbol-picker").value;
document.getElementById("symbol-picker").disabled = true; 
var square = document.getElementById(id);
var square_status = square.title; 
if(square.title == "tom")
{
	var gameIsOver = isDraw(); //kolla om det fortfarande gar att spela

	if(gameIsOver == false) // om det gar att spela
	{	
		square.srcset = user[selectedValue];
		square.title = "maru";

		gameIsOver = foundRow("maru"); // kolla om vit har vunnit
	
		if(gameIsOver) // om vit har vunnit
		{
			gameOver("you won");
		}

		else if(gameIsOver == false) // kolla om det ar oavgjort efter vit drag
		{	
			gameIsOver = isDraw();
			
			if(gameIsOver == false) // annars lat datorn gora sitt drag
			{
				computerMove();
	
				gameIsOver = foundRow("batsu"); // kolla om svart har vunnit
	
				if(gameIsOver)//om svart har vunnit
				{
					gameOver("you lost");
				}
	
			}
			else //oavgjort efter vit drag
			{
				gameOver("draw");
			}
		}


	}
	else //vit kan inte spela
	{	
		gameOver("draw");
	}

}
}
function gameOver(msg)
{
document.getElementById("symbol-picker").disabled = false; 
window.alert(msg);
clearBoard();
}

function isDraw()
{
var squares = document.getElementsByClassName("square")
for(var i = 0;i<squares.length;i++)
{
	if (squares[i].title == "tom")
	{
		return false;
	}
}
return true;
}

function checkMove(id)
{
var square = document.getElementById(id)
if(square.title == "tom")
{
return true;
}
return false;
}

function computerMove()
{
var move = Math.floor(Math.random() * 9) + 1;
var canMove = checkMove(move); 
if(canMove==false)
{
	while(canMove==false)
	{
		move = Math.floor(Math.random() * 9) + 1;
		canMove = checkMove(move);
	}
}

var square = document.getElementById(move);

square.srcset = comp[selectedValue];
square.title = "batsu";

}

function clearBoard()
{
var square_1 = document.getElementById(1);
var square_2 = document.getElementById(2);
var square_3 = document.getElementById(3);

var square_4 = document.getElementById(4); 
var square_5 = document.getElementById(5);
var square_6 = document.getElementById(6);

var square_7 = document.getElementById(7);
var square_8 = document.getElementById(8);
var square_9 = document.getElementById(9);

square_1.srcset = emptySrcset;
square_2.srcset = emptySrcset;
square_3.srcset = emptySrcset;
square_4.srcset = emptySrcset;
square_5.srcset = emptySrcset;
square_6.srcset = emptySrcset;
square_7.srcset = emptySrcset;
square_8.srcset = emptySrcset;
square_9.srcset = emptySrcset;

square_1.title = "tom";
square_2.title = "tom";
square_3.title = "tom";
square_4.title = "tom";
square_5.title = "tom";
square_6.title = "tom";
square_7.title = "tom";
square_8.title = "tom";
square_9.title = "tom";

}

function foundRow(side)
{
var square_1 = document.getElementById(1).title;
var square_2 = document.getElementById(2).title;
var square_3 = document.getElementById(3).title;

var square_4 = document.getElementById(4).title; 
var square_5 = document.getElementById(5).title;
var square_6 = document.getElementById(6).title;

var square_7 = document.getElementById(7).title;
var square_8 = document.getElementById(8).title;
var square_9 = document.getElementById(9).title;


//horizontal
if(square_1 == side && square_2 == side && square_3 == side)
{
	return true;
}
if(square_4 == side && square_5 == side && square_6 == side)
{
	return true;
}
if(square_7 == side && square_8 == side && square_9 == side)
{
	return true;
}

//vertical

if(square_1 == side && square_4 == side && square_7 == side)
{
	return true;
}
if(square_2 == side && square_5 == side && square_8 == side)
{
	return true;
}
if(square_3 == side && square_6 == side && square_9 == side)
{
	return true;
}


//diagonal

if(square_1 == side && square_5 == side && square_9 == side)
{
	return true;
}
if(square_3 == side && square_5 == side && square_7 == side)
{
	return true;
}


return false;
}
function divClicked(id)
{
window.alert(id);
}
//onmouseover
function squareHover(id){
var hover = document.getElementById(id);
if(hover.title == "tom")
{
	hover.srcset = emptyHoverSrcset;
}



}
//onmouseout 
function squareOut(id){
var hover = document.getElementById(id);
if(hover.title == "tom")
{
	hover.srcset = emptySrcset;
}

}



