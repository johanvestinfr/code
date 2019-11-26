//@www.kaaru13.de

var canvas;
var ctx;
var animationOn;
var squareWidth; // width of each square
var squareHeight; // height of each square
var squares; // 2D array of all the squares
var hover;  // the focused square
var hoverChanged = false; 
var timer; // GUI timer
var outOfFocus = false; // hover flag for canvas
var radius; // piece radius
var marginLeft; //margin left for piece p in square s
/*
 * used for clearRect
 */  
var clearMarginX; 
var clearMarginY; 
var clearWidth;
var clearHeight;

var w,h,div,canvas_width;
var lock; //lock for window.resize event
var resizeDone; //flag for canvas resize has been completed
var wait; // resize timer
var map; // 2D array used to check if game over
var gameIsOver = false; // game over flag
var rowLinePoints; // array for saving first and last point of the row 

var rowVertical = false;

/*
 * get pointer position 
 */ 
function getMousePos(canvas, evt) {

	var rect = canvas.getBoundingClientRect();
		return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
	
}
//restart button 
function restart()
{
restartBoard();	
}
//reset the board
function restartBoard()
{
	for(c = 0;c<3;c++)
	{
		for(r = 0;r<3;r++)
		{
			squares[c][r].piece = null;
			squares[c][r].draw();	
			map[c][r] = 0;
				
		}

	}
	setBoard();
	gameIsOver = false;
}
//check if there are any empty squares left on the map
function emptySquaresLeftOnMap()
{
	var c;
	var r;
	for(c = 0;c<3;c++)
	{
		for(r = 0;r<3;r++)
		{
			if (map[c][r] == 0)
			{
				return true;
			}
	
		}
	}
	
	return false;
}
// 2 = X
function iLost()
{
	return checkSquares(2);
}
// 1 = Circle
function iWon()
{
	return checkSquares(1);
}
/*
 * check if row
 */ 
function checkSquares(val)
{
	var r;
	for(r = 0;r<3;r++)
	{
		if(map[0][r] == val && map[1][r] == val && map[2][r] == val)
		{
			rowLinePoints[0][0] = (0 * squareWidth);
			rowLinePoints[0][1] = (r * squareHeight) + radius;
			rowLinePoints[1][0] = (3 * squareWidth);
			rowLinePoints[1][1] = (r * squareHeight) + radius;
			return true;
		}
	}
	var c;
	for(c = 0;c<3;c++)
	{
		if(map[c][0] == val && map[c][1] == val && map[c][2] == val)
		{
			rowLinePoints[0][0] = (c * squareWidth)+ radius;
			rowLinePoints[0][1] = (0 * squareHeight); 
			rowLinePoints[1][0] = c * squareWidth + radius;
			rowLinePoints[1][1] = (3 * squareHeight);
			rowVertical = true;
			return true;
		}

	}
	if(map[0][0] == val && map[1][1] == val && map[2][2] == val)
	{
			rowLinePoints[0][0] = 0 * squareWidth;
			rowLinePoints[0][1] = 0 * squareHeight;
			rowLinePoints[1][0] = 3 * squareWidth;
			rowLinePoints[1][1] = 3 * squareHeight;
			
			return true;
	}
	if(map[2][0] == val && map[1][1] == val && map[0][2] == val)
	{
			rowLinePoints[0][0] = 3 * squareWidth;
			rowLinePoints[0][1] = 0 * squareHeight;
			rowLinePoints[1][0] = 0 * squareWidth;
			rowLinePoints[1][1] = 3 * squareHeight;
			return true;
	}
	return false;
}
/*
 * check if game over
 */ 
function gameOver()
{
		gameIsOver = false;
		if(iWon() == true)
		{
			alert("you won!");
			gameIsOver = true;
		}
		else if(iLost() == true)
		{
			alert("you lost!");
			gameIsOver = true;
		}
		else if(emptySquaresLeftOnMap() == false)
		{
			alert("oavgjort");
			gameIsOver = true;
		}
		if(gameIsOver == true){drawLineThroughRows();}
	return gameIsOver;
}
	

/*
 * inspiration från https://codepen.io/codeBelt/pen/MabgWO/
 * change pixel ratio when resize event is launched
 */ 

function calculateRatio(divWidth,height,maxWidth,maxHeight)
{
	var heightRatio = maxHeight / height;
	var widthRatio = maxWidth / divWidth;

	var ratio = Math.min(widthRatio, heightRatio );
	return {
      canvasWidth: divWidth * ratio,
      canvasHeight: height * ratio
    };
}

/*
 * vänta ett tag utifall att resize event triggas flera gånger
 */ 
async function resizeTimeout()
{
	canvas.style.display = 'none';

	lock = true;
	if(wait != undefined)
	{
		clearTimeout(wait);
	}
	
	wait = await setTimeout(setBoard, 500);	

}

/*
 * starta spelet
 */ 
function setBoard()
{
	setDimensions();
	setUp();
	lock = false;
	resizeDone = true;
}

/*
 * initiera alla variablar som används för att hålla koll på pixel ration
 */ 
function setDimensions()
{
	/*
	 * since canvas width cannot be set to percentage
	 * I decided to use an invisible div to keep track of current window width
	 */ 
	w = div.offsetWidth; // invisible div		
	var w1;
	if(w >= parseFloat(canvas.style.minWidth)){w1 = w;}else{w1 = parseFloat(canvas.style.minWidth);}
	var dimensions = calculateRatio(w1,canvas.height, parseFloat(canvas.style.maxWidth),parseFloat(canvas.style.maxHeight));

	canvas.height = dimensions.canvasWidth;
	canvas.width = dimensions.canvasWidth;
	squareWidth = canvas.width / 3;
	squareHeight = squareWidth;
	marginLeft = squareWidth/ 2;
	radius = squareWidth/3;
	clearMarginX = squareWidth * 0.015;
	clearMarginY = squareHeight * 0.015; 
	clearWidth = squareWidth * 0.035;
	clearHeight = squareHeight * 0.035;
	h = w;
}

/*
 * draw a line through the row
 */ 
function drawLineThroughRows()
{
	console.log("to place " + rowLinePoints[0][0]);
	ctx.beginPath();
	var fifty;
	if(rowVertical == false)
	{
		for(var fifty = 0;fifty < 50;fifty++)
		{
			ctx.moveTo(rowLinePoints[0][0],rowLinePoints[0][1] + fifty);	
			ctx.lineTo(rowLinePoints[1][0],rowLinePoints[1][1] + fifty);	
		}
	}else
	{
		for(var fifty = 0;fifty < 50;fifty++)
		{
			ctx.moveTo(rowLinePoints[0][0] + fifty,rowLinePoints[0][1]);	
			ctx.lineTo(rowLinePoints[1][0] + fifty,rowLinePoints[1][1]);	
		}		
	}
		
	ctx.stroke(); 
	rowVertical = false;
}

/*
 * declare arrays
 */ 
function setUp()
{
var c;
var r;
var id = 0;
map = [[new Array(3)],[new Array(3)],[new Array(3)]];
squares = [[new Array(3)],[new Array(3)],[new Array(3)]];
rowLinePoints = [[new Array(2)],[new Array(2)]];
for(c = 0;c<3;c++)
{
	for(r = 0;r<3;r++)
	{
		squares[c][r] = new Square(c,r,id);
		squares[c][r].draw();	
		map[c][r] = 0;
		id++;		
	}

}

}

/*
 * GUI timer
 */ 
async function callTimer()
{

timer =  await setInterval(animatePieces, 10);	

}

/*
 * animate the pieces
 */ 	
function animatePieces()
{
	
		if(gameIsOver == false)
		{
			if(hover!=undefined)
			{
				if(outOfFocus == false)
				{
					if(hover.piece != undefined)
					{
						if(hover.focus == true)
						{
							hover.hover();	
						}
				
					}
			
				}	
	
			}
		}
	
	//after a resize event
	if(resizeDone == true)
	{
				canvas.style.display = 'initial';
	}
}

class Square
{
		constructor(x,y,id)
		{
			this.x = x;
			this.y = y;
			this.id = id;
			this.piece;
			
		}
		
		createPiece(pieceID)
		{
			switch(pieceID)
			{
				case 1: this.piece = new X(this.x * squareWidth, this.y * squareHeight);
				break;
				case 2:this.piece = new Circle(this.x * squareWidth, this.y * squareHeight);
				break;
			}
				this.piece.paint();
		}
				  
		//piece back to its original position  
		redrawAfterHover()
		{
			this.piece.repaint();
		}
		//animate piece rotation
		hover()
		{
			if(gameIsOver == false)
			{
				this.piece.hover();
			}
		}
	
		wasClicked(x,y)
		{		
	
				var col = x > this.x && x < this.x * squareWidth; 
				var row = y > this.y && y < this.y * squareHeight;
				return col == true && row == true; 
		}

		draw()
		{
			ctx.beginPath();
			ctx.fillStyle = '#000000';
			ctx.fillRect(this.x * squareWidth,this.y * squareHeight,squareWidth,squareHeight);	
			ctx.clearRect((this.x * squareWidth) + clearMarginX, (this.y * squareHeight) + clearMarginY,squareWidth - clearWidth,squareHeight - clearHeight);

		}
		
}
class Piece
{
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
	}
}

class Circle extends Piece
{
	constructor(x,y)
	{
		super(x,y);
		this.circumference = squareWidth / 3;
		this.points = [];
		this.points[0] = 3.14;
		this.points[1] = 3.15;
		this.points[2] = 3-16;
		this.points[3] = 3.17;
		this.points[4] = 3.18;
		this.points[5] = 3.19;
		this.points[6] = 3.20;
		this.points[7] = 3.21;
		this.points[8] = 3.22;
		this.points[9] = 3.23;
		this.focus = false;
		this.points1 = [[new Array(628)],[new Array(628)]];
		this.pointIndex = 10;
		this.initiatePoints();
	}
	
	initiatePoints()
	{
		var c;
		for(c = 0;c< 628;c++)
		{
			this.points1[0][c] = (this.x + marginLeft) + (radius * Math.cos(c/100)); 
			this.points1[1][c] = (this.y + marginLeft) + (radius * Math.sin(c/100));		
		
		}
	}
	
	paint()
	{
		ctx.clearRect(this.x + clearMarginX, this.y + clearMarginY,squareWidth - clearWidth,squareHeight - clearHeight);
		var c;
		ctx.beginPath();
		for(c = 0;c < 628;c++)
		{		
			ctx.lineTo(this.points1[0][c],this.points1[1][c]);		
		}
		ctx.stroke(); 
	}
	
	repaint()
	{
		ctx.clearRect(this.x + clearMarginX, this.y + clearMarginY,squareWidth - clearWidth,squareHeight - clearHeight);
		var c;
		ctx.beginPath();
		for(c = 0;c < 628;c++)
		{		
			ctx.lineTo(this.points1[0][c],this.points1[1][c]);		
		}
		ctx.stroke(); 

	}
	
	hover()
	{	
			if(this.pointIndex < 628){this.pointIndex = this.pointIndex + 10;}else{this.pointIndex = 10;}
			this.duringHover();		
	}
	
	duringHover()
	{

		var p;	
		var len = this.pointIndex;
		ctx.clearRect(this.x + clearMarginX, this.y + clearMarginY,squareWidth - clearWidth,squareHeight - clearHeight);
		ctx.fillStyle = '#000000';
		ctx.beginPath();
		for(p = this.pointIndex - 10;p< len;p++)
		{
			ctx.lineTo(this.points1[0][p],this.points1[1][p]);
		}
		ctx.stroke();

	}
}

class X extends Piece
{
	constructor(x,y)
	{
		super(x,y);
		this.points = []
		this.points[0] = 2.355;
		this.points[1] = 5.495;
		this.points[2] = 3.925;
		this.points[3] = 0.7855;
	}
	
	hover()
	{
		var p;
		for(p = 0;p<this.points.length;p++)
		{
			this.points[p] +=0.0628;
			if(this.points[p] == 6.28){this.points[p] = 0;}				
		}

		this.duringHover();
	}
	
	repaint()
	{
	}
	
	paint()
	{

			console.log("calling ehre as well");
		    ctx.clearRect(this.x + clearMarginX, this.y + clearMarginY,squareWidth - clearWidth,squareHeight - clearHeight);
			
			
			/*
			 * Line 2
			 */
			 
			ctx.beginPath();
			ctx.moveTo((this.x + marginLeft) +(radius * Math.cos(this.points[0])), (this.y + marginLeft) + ( radius * Math.sin(this.points[0])));
			ctx.lineTo(this.x + marginLeft, this.y + marginLeft);	
			ctx.moveTo(((this.x) + marginLeft), (this.y) + marginLeft);
			ctx.lineTo((this.x + marginLeft) +(radius * Math.cos(this.points[1])), (this.y + marginLeft) + ( radius * Math.sin(this.points[1])));		 
			ctx.stroke(); 
			
			/*
			 * Line 1 
			 */ 
			
			ctx.beginPath();
			ctx.moveTo((this.x + marginLeft) +(radius * Math.cos(this.points[2])), (this.y + marginLeft) + ( radius * Math.sin(this.points[2])));
			ctx.lineTo(this.x + marginLeft, this.y + marginLeft);	
			ctx.moveTo(((this.x) + marginLeft), (this.y) + marginLeft);
			ctx.lineTo((this.x + marginLeft) +(radius * Math.cos(this.points[3])), (this.y + marginLeft) + ( radius * Math.sin(this.points[3])));			
			ctx.stroke(); 	
	}
	
	duringHover()
	{
			ctx.clearRect(this.x + clearMarginX, this.y + clearMarginY,squareWidth - clearWidth,squareHeight - clearHeight);		
			
			/*
			 * Line 2
			 */
			 
			ctx.beginPath();
			ctx.moveTo((this.x + marginLeft) +(radius * Math.cos(this.points[0])), (this.y + marginLeft) + ( radius * Math.sin(this.points[0])));
			ctx.lineTo(this.x + marginLeft, this.y + marginLeft);	
			ctx.moveTo(((this.x) + marginLeft), (this.y) + marginLeft);
			ctx.lineTo((this.x + marginLeft) +(radius * Math.cos(this.points[1])), (this.y + marginLeft) + ( radius * Math.sin(this.points[1])));		 
			ctx.stroke(); 
			
			/*
			 * Line 1 OK
			 */ 
			
			ctx.beginPath();
			ctx.moveTo((this.x + marginLeft) +(radius * Math.cos(this.points[2])), (this.y + marginLeft) + ( radius * Math.sin(this.points[2])));
			ctx.lineTo(this.x + marginLeft, this.y + marginLeft);	
			ctx.moveTo(((this.x) + marginLeft), (this.y) + marginLeft);
			ctx.lineTo((this.x + marginLeft) +(radius * Math.cos(this.points[3])), (this.y + marginLeft) + ( radius * Math.sin(this.points[3])));			
			ctx.stroke(); 	
	}
	
}

/*
 * toString override
 * 
 */ 
Circle.prototype.toString = function()
{
    return "O";
}
X.prototype.toString = function()
{
    return "X";
}
Square.prototype.toString = function()
{
	if(this.piece != undefined)
	{
		return this.piece.toString();	
	}
    return "#";
}
/*
 * put X on a random position
 */ 
function computer()
{
	if(emptySquaresLeftOnMap() == true)
	{
		var c = Math.floor(Math.random() * 2);
		var r = Math.floor(Math.random() * 2);
		while(map[c][r] != 0)
		{
			c = Math.floor(Math.random() * 3);
			r = Math.floor(Math.random() * 3);
		}
		squares[c][r].createPiece(1);
		map[c][r] = 2;
	}
}
/*
 * called from body.onload
 */ 
function start()
{
	canvas = document.getElementById("luffarschack");
	ctx = canvas.getContext("2d");
	div = document.getElementById("playground-width");  	
	setBoard();
	
	canvas.addEventListener("click", function (evt) {
	if(gameIsOver == false)
	{
		var mousePos = getMousePos(canvas, evt);
		var col = (Math.ceil(mousePos.x/squareWidth) - 1);
		var row = (Math.ceil(mousePos.y/squareHeight) - 1);
    
		if(map[col][row] == 0)
		{		
			squares[col][row].createPiece(2);
			map[col][row] = 1;	
			computer();
			gameOver();
				
		}
	}
	else
	{
		drawLineThroughRows();
	}
}, false);

$(document).ready(function(){
    $(window).on("resize", function(){ 
		if(lock == false)
		{	
			lock = true;                   
			resizeTimeout();
			if(gameIsOver == true)
			{
			  	restartBoard();
			}			
		}
		
    });
  });

$("#luffarschack" ).mousemove(function( event ) {
 if(gameIsOver == false)
 {
  var mousePos = getMousePos(canvas, event);
  var col = (Math.ceil(mousePos.x/squareWidth) - 1);
  var row = (Math.ceil(mousePos.y/squareHeight) - 1);
  console.log(col + ":" + row);
  
  if(col >= 0 && col <=2 && row >=0 && row <= 2)
  {

  var formerHover = squares[col][row];
  
  outOfFocus = false;
  if(hover != formerHover)
  {

	if(hover!= undefined)
	{
		hover.focus = false;
		if(hover.piece != undefined)
		{
			hover.redrawAfterHover();
		}
			
	}
	

	hover = formerHover;
	hover.focus = true;
  }
  	
  }
}
});

$("#luffarschack").mouseout(function(){
if(gameIsOver == false)
{
if(hover!=undefined)
{
	if(outOfFocus == false)
	{
		if(hover.piece != undefined)
		{
			hover.redrawAfterHover();
			outOfFocus = true;	
			hover.focus = false;
			hover = null;
		}
		
	}
	
} 
}
});
//start GUI timer
callTimer();
}
