// data model for v2
//based on some combination of conway's game of life and probabilistic bizness

var Matrix = function(rows, cols) {
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
    this.conwaysGOL();
    this.print();
}

Matrix.prototype.conwaysGOL = function() {
    var neighbors = 1;
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
	}
    }
    this.matrix = newMatrix;
}

Matrix.prototype.randomStartingState = function() {
    for (i = 0; i < this.rows; i++) {
	var row = "" + i + ": ";
	for (j = 0; j < this.cols; j++) {
	    this.matrix[i][j] = randomInt(0,3) == 0 ? 1 : 0;  // 1 in 4 chaance i think
	}
    }

}

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
