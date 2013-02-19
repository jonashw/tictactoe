function Board(rows,cols,inARow){
	//this Prototype holds th
	new Observable(this);
	this.row_count = rows;
	this.column_count = cols;
	this.inARow = inARow;
	var cells = [];
	for(var r = 0; r < rows; r++){
		cells[r] = [];
		for(var c = 0; c < cols; c++){
			cells[r][c] = null;	
		}
	}
	this.hasCell = function(r,c){
		return r >= 1 && r <= this.row_count && c >= 1 && c <= this.row_count;
	};
	var self = this;
	function requireCell(r,c){
		if(!self.hasCell(r,c)){
			throw "Board: cell does not exist at row, column: " + r + ", " + c; 
		}
	}
	this.cellIsEmpty = function(r,c){
		requireCell(r,c);	
	};
	this.getCell = function(r,c){
		requireCell(r,c);
		return cells[r-1][c-1];
	};
	this.setCell = function(r,c,value){
		requireCell(r,c);
		cells[r-1][c-1] = value;
		this.notifyObservers('cell_changed',r,c,value);
		if (this.hasTicTacToeFor(value)) {
			this.notifyObservers('tic_tac_toe',r,c,value);
		}
	};
	this.hasTicTacToeFor = function(value){//given a value, this works if there is a continuous string ANYWHERE.  It may be a little slow.
		if(!value) return false; //value must be truthy
		/*  For a given point at position X:
				A B C
				D X E
				F G H	
		*/
		var directions = [//R is a dR (row delta), C is a dC (column delta).  Together, they indicate a movement vector.
			{R: 1, C:-1}, //A
			{R: 1, C: 0}, //B
			{R: 1, C: 1}, //C
			{R: 0, C:-1}, //D
			{R: 0, C: 1}, //E
			{R:-1, C:-1}, //F
			{R:-1, C: 0}, //G
			{R:-1, C: 1}  //H
		];
		return cells.some(function(row,r){ //check each row
			return row.some(function(value,c){ //and column
				return directions.some(function(d){ //in every direction
					return check(r + 1, c + 1, d.R, d.C, 1, self.inARow, value);
				});
			});
		});
	};
	function check(r, c, dR, dC, i, length, value){//this function checks for a tic-tac-toe, given a starting position, value, and TTT length
		return !!value && self.hasCell(r,c) && self.getCell(r,c) == value // check 'this' value
			&& (i == length /* end-of-line */ || check(r + dR, c + dC, dR, dC, i + 1, length, value)); //check 'next' values
	}
}
