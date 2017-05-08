// data model for v2
//based on some combination of conway's game of life and probabilistic bizness

var Matrix = function(rows=8, cols=8) {
    this.rows = rows;
    this.cols = cols;
    this.matrix;
    this.initializeMatrix();
}

// initialize a fresh matrix
Matrix.prototype.initializeMatrix = function() {
    this.matrix = new Array();
    for (i = 0; i < this.rows; i++) {
	this.matrix[i] = new Array();
	for (j = 0; j < this.cols; j++) {
	    this.matrix[i][j] = 1;
	}
    }
    this.randomStartingState();
}

Matrix.prototype.progress = function() {
    // this is where you determine the model for progression,
    // currently it is conways game of life
    alive = this.conwaysGOL();
    //this.print();
    return alive;
}

Matrix.prototype.conwaysGOL = function() {
    console.log("iterating conways GOL");
    var neighbors = 1;
    alive_cells = [];
    var newMatrix = new Array();
    for (i = 0; i < this.rows; i++) {
	newMatrix[i] = new Array();
	for (j = 0; j < this.cols; j++) {
	    newMatrix[i][j] = 0;
	}
    }
    
    function _isFilled(matrix, row, col) {
	return matrix[row] && matrix[row][col];
    }

    for (i = 0; i < this.rows; i++) {
	for (j = 0; j < this.cols; j++) {
	    var neighbors = 0,
		alive = 0;
	    
	    if (_isFilled(this.matrix, i-1, j-1)) neighbors++;
	    if (_isFilled(this.matrix, i-1, j)) neighbors++;
	    if (_isFilled(this.matrix, i-1, j+1)) neighbors++;
	    if (_isFilled(this.matrix, i, j-1)) neighbors++;
	    if (_isFilled(this.matrix, i, j+1)) neighbors++;
	    if (_isFilled(this.matrix, i+1, j-1)) neighbors++;
	    if (_isFilled(this.matrix, i+1, j)) neighbors++;
	    if (_isFilled(this.matrix, i+1, j+1)) neighbors++;

	    if (this.matrix[i][j]) { // if alive
		alive = neighbors == 2 || neighbors == 3 ? 1 : 0;
	    } else {
		alive = neighbors == 3 ? 1 : 0;
	    }
	    newMatrix[i][j] = alive;

	    if (alive) {
		alive_cells.push(new Array(i, j));
	    }
	}
    }
    this.matrix = newMatrix;
    return alive_cells;
}

Matrix.prototype.randomStartingState = function() {
    for (i = 0; i < this.rows; i++) {
	var row = "" + i + ": ";
	for (j = 0; j < this.cols; j++) {
	    this.matrix[i][j] = randomInt(0,5) == 0 ? 1 : 0;  // 1 in 4 chaance i think
	}
    }
}

// returns list of cells occupied for any given column
Matrix.prototype.rowsInColumn = function(colNum) {
    var cells = []
    for (i = 0; i < this.rows; i++) {
	if (this.matrix[i][colNum]) {
	    cells.push(i);
	}
    }
    return cells;
}

// returns list of cells occupied for any given row
Matrix.prototype.colsInRow = function(rowNum) {
    var cells = []
    for (i = 0; i < this.cols; i++) {
	if (this.matrix[rowNum][i]) {
	    cells.push(i);
	}
    }
    return cells;
}

// returns true if row empty
Matrix.prototype.rowEmpty = function(rowNum) {
    for (i = 0; i < this.cols; i++) {
	if (this.matrix[rowNum][i] == 1) {
	    return false;
	}
    }
    return true
}
// returns true if column empty
Matrix.prototype.colEmpty = function(colNum) {
    for (i = 0; i < this.rows; i++) {
	if (this.matrix[i][colNum] == 1) {
	    return false;
	}
    }
    return true
}

// returns list of row edges that are occupied, on either far left or far right
Matrix.prototype.rowEdges = function() {
    var edges = []
    for (i = 0; i < this.rows; i++) {
	if (this.matrix[i][0] || this.matrix[i][this.cols-1]) {
	    edges.push(i);
	}
    }
    return edges;
}

// returns list of column edges that are occupied, on either top or bottom 
Matrix.prototype.colEdges = function() {
    var edges = []
    for (i = 0; i < this.cols; i++) {
	if (this.matrix[0][i] || this.matrix[this.rows-1][i]) {
	    edges.push(i);
	}
    }
    return edges;
}

// print helper func
Matrix.prototype.print = function() {
    var total = ""
    for (i = 0; i < this.rows; i++) {
	//var row = "" + i + ": ";
	var row = "";
	for (j = 0; j < this.cols; j++) {
	    row += this.matrix[i][j] + " ";
	}
	total += row + "\n";
    }
    console.log(total);
}
