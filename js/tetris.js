//@www.kaaru13.de
var canvas; //spelbrädet
var ctx;   // referens till spelbrädet
var output;
var output_ctx;
var block;
var blockQueue;
var movedRight = false;
var movedLeft = false;
var clearMargin = 0;
const speed = 20;
var turn = 0;
var blocks = []
var stuck_blocks = []
var currentBlock = 0;
var blockManager;
var types= {LINE:0, CUBE:1}
var type = types.LINE;
var map;
var canMoveDownwards = true;
var mapper;
var run = true;
var rightKeyActivated = true;
var leftKeyActivated = true;
var blocksToDraw = [[new Array(1)],[new Array(1)]];
var stop = false;
var rowsWhereBlockPlaced = {};
var fallingBlock;
var canvas_width;
var gameMessages;
var bitSize;
var score = 0;
var scoreBoard;
var scoreBoardCtx;
const courtRowCount = 20;
var fastForward = false;
var nextBlockBoard;
var nextBlockBoardCtx;
var blockQueue = [];
var canRotate = true;

function startTetris()
{
gameMessages = document.getElementById('gameMessages');
canvas = document.getElementById('tetris_form');
ctx = canvas.getContext('2d');
canvas_width = canvas.width;
bitSize = canvas_width/10;
blockQueue = new BlockQueue([1,2,3]);
scoreBoard = document.getElementById('score');
scoreBoardCtx = scoreBoard.getContext('2d');
nextBlockBoard = document.getElementById('next-block-board');
nextBlockBoardCtx = nextBlockBoard.getContext('2d');

blockManager = new BlockManager();
map  = new Map();
timer = setInterval(runTetris, 1000);
document.addEventListener('keydown',keyDown,false);
document.addEventListener('keyup',keyUp,false);

}
let i = 50;

function runTetris()
{
if(fastForward == false)
{
blockManager.runGame();
}
}

/*
 * kolla om alla nummer i listan är i följd
 * n = (n -1) + 1 (1,2,3) = true (2,1,3) = false
 */ 
var tempVal = 0;
function checkIsSequence(val) {
  if( tempVal == 0){tempVal = parseInt(val, 10); return true;} 
  else
  {
    tempVal = tempVal + 1;
  	console.log("val:" + val + "  tempVal:" + tempVal);
  	return val == tempVal;
  }
}


function updateScore(points)
{
	scoreBoardCtx.clearRect(0,0,scoreBoard.width,scoreBoard.height);
	score += (100 * points);
	scoreBoardCtx.font = "20px Arial";		
	scoreBoardCtx.fillText(score, 30 , 25);
}


/*
 * kolla om det går att rotera om klossen rör sig till vänster
 */ 
function checkLeft(arr)
{
	var x,y,len;
	var next = 1;
	console.log("checking left :" + arr.length);
	for(x = 0;x<arr.length;x++)
	{
			if(map.getCord(arr[x][0] - next,arr[x][1]) != 0)
			{
				next = 0;
				console.log(arr[x][0] + " i s x");
				break;
			}
			
	}
	if(next == 0)
	{
		next = 2;
		for(x = 0;x<arr.length;x++)
		{
			if(map.getCord(arr[x][0] - next,arr[x][1]) != 0)
			{
				next = 0;
				break;
			}
			
		}
	}
	if(next == 0)
	{
		next = 3;
		for(x = 0;x<arr.length;x++)
		{
			if(map.getCord(arr[x][0] - next,arr[x][1]) != 0)
			{
				next = 0;
				break;
			}
			
		}
	}
	if(next == 0)
	{
		next = 4;
		for(x = 0;x<arr.length;x++)
		{
			if(map.getCord(arr[x][0] - next,arr[x][1]) != 0)
			{
				next = 0;
				break;
			}
			
		}
	}

	return next;

		
}

/*
 * kolla om det går att rotera om klossen rör sig till höger
 */ 

function checkRight(arr)
{
	var x,y,len;
	var next = 1;
	for(x = 0;x<arr.length;x++)
	{
			if(map.getCord(arr[x][0] + next,arr[x][1]) != 0)
			{
				next = 0;
				break;
			}
			
	}
	if(next == 0)
	{
		next = 2;
		for(x = 0;x<arr.length;x++)
		{
			if(map.getCord(arr[x][0] + next,arr[x][1]) != 0)
			{
				next = 0;
				break;
			}
			
		}
	}
	if(next == 0)
	{
		next = 3;
		for(x = 0;x<arr.length;x++)
		{
			if(map.getCord(arr[x][0] + next,arr[x][1]) != 0)
			{
				next = 0;
				break;
			}
			
		}
	}
	if(next == 0)
	{
		next = 4;
		for(x = 0;x<arr.length;x++)
		{
			if(map.getCord(arr[x][0] + next,arr[x][1]) != 0)
			{
				next = 0;
				break;
			}
			
		}
	}
	return next;
}

/*
 * Rotera blocket
 */ 

function rotateBlock(obj)
{
		obj.getCurrentPositions();
		var max_y = 0;
		var x,y,lx,ly,could_rotate;
		var xMargin = 0;
		var yMargin = 0;
		var canReposition = false;
		var xx;
		var stepLeft;
		var stepRight;
		var rotated = false;
		var repositionedBits = [];
		x = obj.bits[0].x
		y = obj.bits[0].y
		lx = obj.bits[0].locX;
		ly = obj.bits[0].locY;
		
		for(xx = 0;xx < obj.bits.length;xx++)
		{
				repositionedBits[xx] = new Array(2);
		}
		
		
		var i,calX,calcY,calcLocX,calcLoxY;
		could_rotate = true;
		
		if(map == undefined)
		{
			for( i = 0;i<obj.bits.length;i++)
			{		
					obj.bits[i].x = x;
					obj.bits[i].y = y;
					obj.bits[i].locX = lx;
					obj.bits[i].locY = ly;
					
					obj.bits[i].x += (obj.rotations[obj.rotateIndex][i][0] * bitSize);
					obj.bits[i].y += (obj.rotations[obj.rotateIndex][i][1] * bitSize);
					obj.bits[i].locX += obj.rotations[obj.rotateIndex][i][0];
					obj.bits[i].locY += obj.rotations[obj.rotateIndex][i][1];
		
			}
		}else
		{	
					for( i = 0;i<obj.bits.length;i++)
					{	

					
						calcLocX = lx + obj.rotations[obj.rotateIndex][i][0];
						calcLocY = ly + obj.rotations[obj.rotateIndex][i][1];
						repositionedBits[i][0] = calcLocX;
						repositionedBits[i][1] = calcLocY;
						
						if(map.getCord(calcLocX,calcLocY) != 0)
						{
							
								could_rotate = false;							

						}	
					}
					
					if(could_rotate == false)
					{
						stepLeft = checkLeft(repositionedBits);
						console.log("returned value = " + stepLeft);
						if(stepLeft ==0)
						{
							console.log("left:" + stepLeft);
								stepRight = checkRight;
								if(stepRight>0){canReposition = true; console.log("right:" + stepRight);}
						}else{canReposition = true; }
						
					}
					
					if(could_rotate == true)
					{
						console.log("")
						for( i = 0;i<obj.bits.length;i++)
						{		
								obj.bits[i].x = x;
								obj.bits[i].y = y;
								obj.bits[i].locX = lx;
								obj.bits[i].locY = ly;						
								obj.bits[i].y += (obj.rotations[obj.rotateIndex][i][1] * bitSize);

								obj.bits[i].x += (obj.rotations[obj.rotateIndex][i][0] * bitSize);
								obj.bits[i].locX += obj.rotations[obj.rotateIndex][i][0];	
								obj.bits[i].locY += obj.rotations[obj.rotateIndex][i][1] ;
						}
							
							
						rotated = true;
				
						}
					else if( canReposition == true)
					{
						for( i = 0;i<obj.bits.length;i++)
						{		
								obj.bits[i].x = x;
								obj.bits[i].y = y;
								obj.bits[i].locX = lx;
								obj.bits[i].locY = ly;						
								obj.bits[i].y += (obj.rotations[obj.rotateIndex][i][1] * bitSize);

								obj.bits[i].locY += obj.rotations[obj.rotateIndex][i][1] ;
								
								if(stepRight > 0)
								{
									obj.bits[i].locX += obj.rotations[obj.rotateIndex][i][0] + stepRight;
									obj.bits[i].x += (obj.rotations[obj.rotateIndex][i][0] * bitSize) + (stepRight * bitSize);
								}else if(stepLeft > 0)
								{
									console.log("turning left:" + stepLeft);
									obj.bits[i].locX += obj.rotations[obj.rotateIndex][i][0] - stepLeft;	
									obj.bits[i].x += (obj.rotations[obj.rotateIndex][i][0] * bitSize) - (stepLeft * bitSize);
								}else
								{
									obj.bits[i].x += (obj.rotations[obj.rotateIndex][i][0] * bitSize);
									obj.bits[i].locX += obj.rotations[obj.rotateIndex][i][0];	
								}
						}
						
						rotated = true;
						
					}
					
					repositionedBits = null;
			
		}

		if(rotated== true)
		{
			obj.rotateIndex += 1;
			if(obj.rotateIndex > 3)
			{
				obj.rotateIndex = 0;
			}
		}
		rotated = false;
}

/*
 * Generera ett block
 */ 

function generateRandomBlock(block)
{
	switch(block)
	{
		case 1:
		return new I(0,0);
		break;
		case 2:
		return new O(0,0);
		break;
		case 3:
		return new J(0,0);
		break;
		case 4: 
		return new L(0,0);
		break;
		case 5: 
		return new S(0,0);
		break;
		case 6:
		return new T(0,0);
		break;
		case 7:
		return new Z(0,0);
		break;
	}
	
}

/*
 * Färg på klossen efter den har blivit placerad
 */ 

function getBitColor(number)
{
		switch(number)
	{
		case 1:
		return '#0f0';
		break;
		case 2:
		return '#FFFF00';
		break;
		case 3:
		return '#0000FF';
		break;
		case 4: 
		return '#FFA500';
		break;
		case 5: 
		return '#0f0';
		break;
		case 6:
		return '#800080';
		break;
		case 7:
		return '#ff0000';
		break;
	}
}


/*
 * för att visa nästa 3 block
 */ 
function getBlockPainting(block)
{
	switch(block)
	{
			case 1:
		return new Array([0,0],[1,0],[2,0],[3,0]);
		break;
		case 2:
		return new Array([0,0],[0,1],[1,1],[1,0]);
		break;
		case 3:
		return new Array([0,0],[0,1],[1,1],[2,1]);
		break;
		case 4: 
		return new Array([0,1],[1,1],[2,1],[2,0]);
		break;
		case 5: 
		return new Array([0,1],[1,1],[1,0],[2,0]);
		break;
		case 6:
		return new Array([0,1],[1,1],[1,0],[2,1]);
		break;
		case 7:
		return new Array([0,0],[1,0],[1,1],[2,1]);
		break;
	}
}


function printToBlockBoard()
{
	var x,t;
	var b = blockQueue.getBlocks();
	var temp;
	nextBlockBoardCtx.clearRect(0 ,0, 200,200);
	for(x = 0;x< b.length;x++)
	{
		temp = getBlockPainting(b[x]);
		for(t = 0;t<temp.length;t++)
		{
			nextBlockBoardCtx.fillStyle = '#000000';
			nextBlockBoardCtx.fillRect(10 + temp[t][0] * bitSize,((x+1) * 50) + (temp[t][1]) * bitSize,bitSize,bitSize);	
			nextBlockBoardCtx.fillStyle = getBitColor(b[x]);
			nextBlockBoardCtx.fillRect(10 + temp[t][0] * bitSize + 2.5, ((x+1) * 50) + (temp[t][1]) * bitSize + 2.5,bitSize - 5,bitSize - 5);	
		}
	

	}
	
}

/*
 * klass som används för att begränsa blockrörelser
 */ 

class Map
{
		constructor()
		{
				this.cord = [[new Array(21)],[new Array(21)],[new Array(21)],[new Array(21)],[new Array(21)],[new Array(21)],[new Array(21)],[new Array(21)],[new Array(21)],[new Array(21)],
				[new Array(21)],[new Array(21)],[new Array(21)]];
				this.initateMap();
		}
		initateMap()
		{
			var y;
			var x;
			var add;	
								
			
			for(x = 1;x<12;x++)
			{
					for(y =0;y<courtRowCount;y++)
					{
						this.cord[x][y] = 0 ;
					}
			}
			
			var left_side;
			var right_side;
			var bottom_side = 20;
			
			for(left_side = 0;left_side < 21;left_side++)
			{
				this.cord[0][left_side] = -1;
			}
			
			for(right_side = 0;right_side < 21;right_side++)
			{
				this.cord[11][right_side] = -1;
			}

			this.cord[0][bottom_side] = 999;
			this.cord[1][bottom_side] = 999;
			this.cord[2][bottom_side] = 999;
			this.cord[3][bottom_side] = 999;
			this.cord[4][bottom_side] = 999;
			this.cord[5][bottom_side] = 999;
			this.cord[6][bottom_side] = 999;
			this.cord[7][bottom_side] = 999;
			this.cord[8][bottom_side] = 999;
			this.cord[9][bottom_side] = 999;
			this.cord[10][bottom_side] = 999;
			this.cord[11][bottom_side] = 999;
			this.cord[12][bottom_side] = 999;
		}
		
		redrawMap()
		{
			ctx.clearRect(0 ,0, 200,400);
			var x;
			var y;
			for(x = 1;x<11;x++)
			{
					for(y =0;y<courtRowCount;y++)
					{
						var finder = this.getCord(x,y);
						if(finder>=1)
						{
						ctx.fillStyle = '#000000'; 				
						ctx.fillRect((x * bitSize) - bitSize,y * bitSize,bitSize,bitSize);	
						ctx.fillStyle = getBitColor(map.getCord(x,y));
						ctx.fillRect(((x * bitSize) - bitSize) + 2.5,(y * bitSize) + 2.5,15,15);	
							
						}
					
					}
			}
			
			
		}
		
		setPositions(positions,obj)
		{
			var p;	
			for(p = 0;p<positions.length;p++)
			{
				
				var x = positions[p][0];
				var y = positions[p][1];
				if(y in rowsWhereBlockPlaced)
				{
					rowsWhereBlockPlaced[y] +=  1;
				
				}else
				{
					rowsWhereBlockPlaced[y] = 1;
				}

				this.cord[x][y] = obj.getColorIndex();
								
			}
			
		}
		
		gameOver()
		{
			var x;
			for(x = 1;x<11;x++)
			{
				if(this.cord[x][0] >= 1)
				{
						return true;
				}
			}
			return false;
		}

	isRow(item)
	{
		return item == 1; 
	}

			getCord(x,y)
			{
				if(x < 1 || x > 11 ){return -1;}
				else if(y < 0 || y > 39) {return 999;}
				return this.cord[x][y];
			}
			

				checkIfRow()
				{
					var rows = [];
					var y;
					var x;
					var temp;
					var isRow = true;
					for(var key in rowsWhereBlockPlaced) {
						var value = rowsWhereBlockPlaced[key];
						if(value==10)
						{

							rows.push(key);	
							
						}
						
																
					}
					
					
					return rows;
				}
				
				clearRow(rows)
				{
					var r;
					var x;

					for(r =0;r<rows.length;r++)
					{
						for(x = 1;x<11;x++)
						{						
							this.cord[x][rows[r]] = 0;					

						}
						rowsWhereBlockPlaced[rows[r]] = 0;

					}
					
					
				}
				fixMap(rows)
				{
					var x;
					var y;
					var aboveBlock = 1 ;
					var currentBlock = 0;
					var isSequence = false;
				    var maximumVal = Math.max.apply(Math, rows); 

				    if(rows.length > 1)
				    {
						isSequence = rows.every(checkIsSequence);
					}			
					
					if(isSequence == true)
					{
						this.sortRow(rows);
					}else
					{
						this.sortSingleRow(rows);
					}
						

						}	

				/**
				 * används då raderna stackas
				 */ 
				
				sortRow(rows)
				{
					
					var minimum_val = Math.max.apply(Math, rows); 
					var firstRow = minimum_val;
					var steps = rows.length ;

					var y,x,z;
					
					for(z = 0; z<rows.length;z++)
					{
					for(x = 1;x<11;x++)
						{
						for(y = firstRow;y > 0;y--)
						{
							if(this.cord[x][y -1] >= 1 && this.cord[x][y] == 0){
							this.cord[x][y] = this.cord[x][y -1];
							this.cord[x][y - 1] = 0;
							rowsWhereBlockPlaced[y - 1] -= 1;
							rowsWhereBlockPlaced[y] += 1;
							}
							
						
						}
						
					}
				}
				}
				sortSingleRow(rows)
				{
					var x,y;
					var maximumVal = Math.max.apply(Math, rows); 
					this.oneRowFix(x,y,parseInt(maximumVal, 10));

				}
				
				multipleRowFix(rows,x,y)
				{
					
				}
				
				oneRowFix(x,y,start_row)
				{
				
					for(x = 1;x<11;x++)
						{
							for(y = start_row;y > 0;y--)
							{
								
								
								if(map.getCord(x,(y -1)) >= 1 && map.getCord(x,y) == 0)
								{
									this.cord[x][y] = this.cord[x][y - 1];
									this.cord[x][y - 1] = 0;																
									rowsWhereBlockPlaced[y - 1] -= 1;
									rowsWhereBlockPlaced[y] += 1;
								
								}
							
								
								
							}
						}
						
				}
				

}



class BlockManager
{
	constructor() 
	{
	this.createBlock();
	this.directions = {RIGHT:'right',LEFT:'left', DOWN:'down'}	
	this.direction = this.directions.DOWN;		
	this.change = false;
	
	}
	
	createBlock()
	{
			printToBlockBoard();
			fallingBlock = generateRandomBlock(blockQueue.peek());
	}

	
	runGame()
	{
		if(run == true)
		{

			fallingBlock.clear();
			if(	fallingBlock.fallDown("down") == true)
			{
				if(map.gameOver() == true){run = false;gameMessages.innerHTML = "Game Over!";}
				
					
				
				fallingBlock.drawBits();
				var rows = map.checkIfRow();
				if(rows.length > 0)
				{

						map.clearRow(rows);
						map.fixMap(rows);
						map.redrawMap();
						updateScore(rows.length);
				
						
								
				}
				blockQueue.next();
				this.createBlock();
				
				fastForward = false;
		
			}else{
				

				
			}
			
			fallingBlock.drawBits();
			this.direction = this.directions.DOWN;
	}
		

	}
}

/*
 * queue för att lagra genererade block
 */ 
class BlockQueue
{
constructor() 
{
	this._blocks = [];
	this._blocks[0] = (Math.floor(Math.random() * 7) + 1);
	this._blocks[1] = (Math.floor(Math.random() * 7) + 1);
	this._blocks[2] = (Math.floor(Math.random() * 7) + 1);
}
enqueue(val){
     this._blocks.push(val);   
  }

  dequeue(){
    this._blocks.splice(0,1);
    return this._blocks;
  }

  peek(){
    return this._blocks[0]
  }
  next()
  {
	 this.dequeue();
	 this.enqueue((Math.floor(Math.random() * 7) + 1));
  }
  
 getBlocks(){return this._blocks;}
 

}

/*
 * class för att organizera 'bits'
 * används för funktioner som involverar alla delar i ett block
 * 
 */ 

class Block
{	
constructor(x,y) 
{

	this.locations = [];

	this.movedSideways = false;
	this.botBlock = 1;
}

clear()
{
		var b;
	for(b = 0; b < this.bits.length;b++)
	
	{
	this.bits[b].clearRectangle();
	}
	
}

moveBitsDown(rows)
{
	var b;
	var r;

	for(b = 0; b < this.bits.length;b++)
	{
			for(r = 0;r < rows.length;r++)
			{
				if(this.bits[b].locY < rows[r])
				{
						this.bits[b].MoveDown();
				}
						
			}
	}
	this.getCurrentPositions();
	
}

removeBits(rows)
{
	var b;
	var r;
	var found_row = false;
	for(r = 0;r < rows.length;r++)
	{
	for(b = 0; b < this.bits.length;b++)
	{
			
					
					if(this.bits[b].locY == rows[r])
					{
			
							this.bits = this.bits.filter(function(item) { 
								return item.locY != rows[r]
							});
							
							if(map.getCord(this.bits[b].locX,this.bits[b].locY + 1) == 0)
							{
									this.bits[b].locY = this.bits[b].locY + 1; 
									this.bits[b].locY = this.bits[b].y + 20; 
							}
						
					}
			
	}
	
			
	}
	
		   this.getCurrentPositions();
		   map.setPositions(this.locations,this);
}

drawBits()
{
	
	var b;
	var remove_list = [];
	for(b = 0; b < this.bits.length; b++)
	{		
		
		this.bits[b].draw(fallingBlock.color);
		if(this.bits[b].removeThisBit()== true)
		{
			remove_list.push(b);
		}
	}	
	var remove_count;
	for(remove_count = 0; remove_count < remove_list.length;remove_count++)
	{
			this.bits.splice(remove_list[remove_count],1);
	}
	
}
bitsSetStuck()
{
	var b;
	for(b = 0; b < this.bits.length; b++)
	{
		
		this.bits[b].stuck = true;
	}	
}
	
fallDown(direction)
{
	this.getCurrentPositions();
	var x;
	
	canMoveDownwards = this.checkPositions(direction); 
	
	if(canMoveDownwards == true)
	{
			direction = "down";
			for(x = 0;x < this.bits.length;x++)
			{
				this.bits[x].move(direction);			
			}
			this.movedSideways = false;
			return false;
	
	}                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
	this.bitsSetStuck();
	map.setPositions(this.locations,this);
	map.checkIfRow();
	return true;
}

	
		checkPositions(dir)
		{
			this.getCurrentPositions();
				
				var floor;
				for(floor = 0;floor<this.locations.length;floor++)
				{
					if(map.getCord([this.locations[floor][0]],[this.locations[floor][1] + 1]) == 999)
					{

						return false;	
					}
				}

				
			var p;
			for(p = 0;p<this.locations.length;p++)
			{
				if(map.getCord([this.locations[p][0]],[this.locations[p][1] + 1]) >= 1 )
				{

				return false;	
				}
				
			}
			return true;
		}

				canMoveSideways(dir,pos)
				{	
				this.getCurrentPositions();
				var map_check;
				 if(dir=="right")
				 {
					
					console.log("in right" + this.locations.length);
					var p;
					for(p = 0;p<this.locations.length;p++)
					{
						map_check = map.getCord(this.locations[p][0] + 1,this.locations[p][1]);
						if(map_check != 0 )
						{

						return false;	
						}
					}
					
							
					
				}
			else if(dir=="left")
		    {

					var p;
					for(p = 0;p<this.locations.length;p++)
					{
						map_check = map.getCord((pos[p][0] - 1),pos[p][1]);
						if(map_check !=0 )
						{

						return false;	
						}
					}
					
				
				}
			
			
		
			return true;
		}


   getCurrentPositions()
	{
	var x;
	for(x = 0;x < this.bits.length;x++)
	{
			
			this.locations[x] = new Array(2);
			this.locations[x][0] = this.bits[x].locX;
			this.locations[x][1] = this.bits[x].locY;
		}
	
	
	}



}

class I extends Block
{
constructor(x,y) {
		
        super(x,y);

        this.rotations = new Array(Array([0,0],[1,0],[2,0],[3,0]),Array([0,0],[0,1],[0,2],[0,3]),Array([0,0],[1,0],[2,0],[3,0]),Array([0,0],[0,1],[0,2],[0,3]));
        this.color = '#0f0';
        this.botBlock = 3;
        this.rotateIndex = 0;
        this.bits = Array(new Bit(0,0,bitSize,bitSize,1,0,this.color),new Bit(0,0,bitSize,bitSize,1,1,this.color),new Bit(0,0,bitSize,bitSize,2,1,this.color),new Bit(0,0,bitSize,bitSize,3,1,this.color));
        this.botBlock = 2;
		this.rotate();
    }							
	rotateMethods()
	{
		this.clear();
		this.rotate();
		this.drawBits();	
	}
	
	getRightBit()
	{
		return this.bits[3];
	}
	rotate()
	{
		rotateBlock(this);
	}
	
	getColorIndex(){return 1;}

	
	

}

 class O extends Block
{
	constructor(x,y) {
		
        super(x,y);
		
        this.rotations = new Array(Array([0,0],[0,1],[1,1],[1,0]),Array([0,0],[0,1],[1,1],[1,0]),Array([0,0],[0,1],[1,1],[1,0]),Array([0,0],[0,1],[1,1],[1,0]));
        this.color = '	#0000FF';
        this.botBlock = 3;
        this.rotateIndex = 0;
        this.bits = Array(new Bit(0,0
        ,bitSize,bitSize,1,0,this.color),new Bit(0,0,bitSize,bitSize,1,1,this.color),new Bit(0,0,bitSize,bitSize,2,1,this.color),new Bit(0,0,bitSize,bitSize,3,1,this.color));
        this.botBlock = 2;
		this.rotate();
    }	
    						
	rotateMethods()
	{
		this.clear();
		this.Rotate();
		this.DrawBits();	

	}
	
	getRightBit()
	{
		return this.bits[3];
	}
	rotate()
	{
		rotateBlock(this);
	}
	getColorIndex(){return 3;}
}


 class J extends Block
{
	constructor(x,y) {
		
        super(x,y);
		
        this.rotations = new Array(Array([0,0],[0,1],[1,1],[2,1]),Array([0,0],[0,1],[0,2],[1,0]),Array([0,0],[1,0],[2,0],[2,1]),Array([0,2],[1,1],[1,2],[1,0]));
        this.color = '	#0000FF';
        this.botBlock = 3;
        this.rotateIndex = 0;
        this.bits = Array(new Bit(0,0,bitSize,bitSize,1,0,this.color),new Bit(0,0,bitSize,bitSize,1,1,this.color),new Bit(0,0,bitSize,bitSize,2,1,this.color),new Bit(0,0,bitSize,bitSize,3,1,this.color));
        this.botBlock = 2;
		this.rotate();
    }							
	rotateMethods()
	{
	this.clear();
	this.rotate();
	this.drawBits();	

	}
	
	getRightBit()
	{
		return this.bits[3];
	}
	rotate()
	{
		rotateBlock(this);
	}
	getColorIndex(){return 3;}
}

class L extends Block
{
	constructor(x,y) {
		
        super(x,y);

        this.rotations = new Array(Array([0,1],[1,1],[2,1],[2,0]),Array([0,0],[0,1],[0,2],[1,2]),Array([0,0],[1,0],[2,0],[0,1]),Array([0,0],[1,0],[1,1],[1,2]));
        this.color = '#FFA500';
        this.botBlock = 3;
        this.rotateIndex = 0;
        this.bits = Array(new Bit(0,0,bitSize,bitSize,1,0,this.color),new Bit(0,0,bitSize,bitSize,1,1,this.color),new Bit(0,0,bitSize,bitSize,2,1,this.color),new Bit(0,0,bitSize,bitSize,3,1,this.color));
        this.botBlock = 2;
		this.rotate();
    }							
	rotateMethods()
	{
	this.clear();
	this.rotate();
	this.drawBits();	

	}
	
	rotate()
	{
		rotateBlock(this);
	}
	getColorIndex(){return 4;}
}

class S extends Block
{
	constructor(x,y) {
		
        super(x,y);

        this.rotations = new Array(Array([0,1],[1,1],[1,0],[2,0]),Array([0,0],[0,1],[1,1],[1,2]),Array([0,2],[1,2],[1,1],[2,1]),Array([0,0],[0,1],[1,1],[1,2]));
        this.color = '#0f0';
        this.botBlock = 3;
        this.rotateIndex = 0;
        this.bits = Array(new Bit(0,0,bitSize,bitSize,1,0,this.color),new Bit(0,0,bitSize,bitSize,1,1,this.color),new Bit(0,0,bitSize,bitSize,2,1,this.color),new Bit(0,0,bitSize,bitSize,3,1,this.color));
        this.botBlock = 2;
		this.rotate();
    }							
	rotateMethods()
	{
		this.clear();
		this.rotate();
		this.drawBits();	
	}

	rotate()
	{
		rotateBlock(this);
	}
	getColorIndex(){return 5;}
}
class T extends Block
{
	constructor(x,y) {
		
        super(x,y);

        this.rotations = new Array(Array([0,1],[1,1],[1,0],[2,1]),Array([0,0],[0,1],[1,1],[0,2]),Array([0,0],[1,0],[1,1],[2,0]),Array([1,0],[1,1],[0,1],[1,2]));
        this.color = '#800080';
        this.rotateIndex = 0;
        this.bits = Array(new Bit(0,0,bitSize,bitSize,1,0,this.color),new Bit(0,0,bitSize,bitSize,1,1,this.color),new Bit(0,0,bitSize,bitSize,2,1,this.color),new Bit(0,0,bitSize,bitSize,3,1,this.color));
        this.botBlock = 2;
		this.rotate();
    }	
    						
	rotateMethods()
	{
		this.clear();
		this.rotate();
		this.drawBits();	
	}

	rotate()
	{
		rotateBlock(this);
	}
	getColorIndex(){return 6;}
}

class Z extends Block
{
	constructor(x,y) {
		
        super(x,y);

        this.rotations = new Array(Array([0,0],[1,0],[1,1],[2,1]),Array([1,1],[1,2],[2,1],[2,0]),Array([0,1],[1,1],[1,2],[2,2]),Array([0,1],[0,2],[1,1],[1,0]));
        this.color = '#ff0000';
        this.rotateIndex = 0;
        this.bits = Array(new Bit(0,0,bitSize,bitSize,1,0,this.color),new Bit(0,0,bitSize,bitSize,1,1,this.color),new Bit(0,0,bitSize,bitSize,2,1,this.color),new Bit(0,0,bitSize,bitSize,3,1,this.color));
        this.botBlock = 2;
		this.rotate();
    }							
	rotateMethods()
	{
	this.clear();
	this.rotate();
	this.drawBits();	

	}
	
	rotate()
	{
		rotateBlock(this);
	}
	getColorIndex(){return 7;}
}
 
class Bit {
  constructor(x,y,width,height,locX,locY,color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.stuck = false;
    this.locX = locX;
    this.locY = locY;
    this.stuck = false;
	this.canRemove = false;
	this.color = color;
  }
	
	getX(){return this.x;}
	
	moveDown()
	{

	this.y = this.y + bitSize;
	this.locY = this.locY + 1;	
	}
	
	draw(color)
	{
	this.drawBit(color);
	}
	
	removeThisBit()
	{
			return this.canRemove;
	}
	
	clearRectangle()
	{
	ctx.clearRect(this.x ,this.y, this.width,this.height);	
	}
	
	drawBit(color)
	{
	ctx.fillStyle = '#000000';
	ctx.fillRect(this.x,this.y,this.width,this.height);	
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x + 2.5,this.y + 2.5,this.width - 5,this.height - 5);	
	
	}
	

	
	moveSideways(direction)
	{
		if(direction=="left"){this.locX = this.locX - 1; this.x = this.x - speed;} 
		else if (direction=="right"){this.locX = this.locX + 1; this.x = this.x + speed;} 
		this.drawBit();
	}
	
    move(direction) {
	
    this.y = this.y + speed;
    this.locY = this.locY + 1; 
	
    }
   
    
    
	}



function keyDown(e)
{
if(e.keyCode == 39)
{
	if(rightKeyActivated == true)
	{
		var sideways = fallingBlock.canMoveSideways(blockManager.directions.RIGHT,fallingBlock.locations);
		if(sideways == true)
		{
			fallingBlock.clear();
			for(x = 0;x < fallingBlock.bits.length;x++)
				{
					fallingBlock.bits[x].moveSideways(blockManager.directions.RIGHT);
			
				}	
	

		}
	
 rightKeyActivated = false;	
}
}
if(e.keyCode == 37)
{
if(leftKeyActivated == true)
{

 var sideways = fallingBlock.canMoveSideways(blockManager.directions.LEFT,fallingBlock.locations);

		if(sideways == true)
		{
				fallingBlock.clear();
				
				for(x = 0;x < fallingBlock.bits.length;x++)
				{
					fallingBlock.bits[x].moveSideways(blockManager.directions.LEFT);
			
				}	
			
			
		}
	leftKeyActivated = false;
}
}

if(e.keyCode == 87)
{
	if(canRotate == true)
	{
		fallingBlock.rotateMethods();
		canRotate = false;
	}

}
if(e.keyCode == 40)
{
	fastForward = true;
	blockManager.runGame();
}

console.log(e.keyCode);

}
function keyUp(e)
{
	if(e.keyCode == 37)
	{
		leftKeyActivated = true;
	}
	if(e.keyCode == 39)
	{
		rightKeyActivated = true;
	}
	if(e.keyCode == 40)
	{
	fastForward = false;
	
	}
	if(e.keyCode == 87)
	{
		canRotate = true;
	}
}


