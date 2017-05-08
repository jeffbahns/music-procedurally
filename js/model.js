var Model = function(context, rows=8, cols=8) {
    this.rows = rows;
    this.cols = cols;
    this.context = context;
    this.instr = [];
    this.matrix = new Matrix(rows, cols);
    this.grid = new MusicGrid(rows, cols);
    this.musicModel = new MusicModel(context, rows, cols);
    this.grid.drawGrid();
    this.currentCol = 0;
    this.progress();
}

Model.prototype.play = function() {
    if (this.currentCol == this.cols) {
	this.progress();
	this.currentCol = 0;
    }
    this.musicModel.play(this.matrix, this.currentCol);
    this.currentCol += 1;
    console.log("current col ", this.currentCol)
}

Model.prototype.progress = function() {
    alive = this.matrix.progress();
    this.grid.update(alive);
}

