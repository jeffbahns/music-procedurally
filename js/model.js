var Model = function(context, seed, scale, rows = 8, cols = 8) {
    this.context = context;
    this.seed = seed % Math.pow(2,16);

    this.rows = rows;
    this.cols = cols;

    this.matrix = new Matrix(this.seed, rows, cols);
    this.musicModel = new MusicModel(context, this.matrix, scale, rows, cols);
    this.grid = new MusicGrid(rows, cols);
    this.grid.drawGrid();
    this.currentCol = 0;
    this.matrix.print();
    this.grid.update(this.matrix.aliveCells(), this.currentCol);
}

Model.prototype.play = function() {
    if (this.currentCol == this.cols) {
        this.progress();
        this.currentCol = 0;
    }

    this.grid.update(this.matrix.aliveCells(), this.currentCol);
    this.musicModel.play(this.matrix, this.currentCol);
    this.currentCol += 1;
    console.log("current col ", this.currentCol);
}

Model.prototype.progress = function() {
    this.matrix.progress();
    console.log(alive);
    this.grid.update(this.matrix.aliveCells(), this.currentCol);
}

// getters
Model.prototype.scale = function() {
    return this.musicModel.base_scale.root_note + " " + this.musicModel.base_scale.type;
}

Model.prototype.root_note = function() {
    return this.musicModel.base_scale.root_note;
}

Model.prototype.scale_type = function() {
    return this.musicModel.base_scale.type;
}

Model.prototype.getSeed = function() {
    return this.matrix.getSeed();
}

Model.prototype.addSquare = function(d) {
  // alive.push(new Array(d.row, d.col));
  // console.log(m);
  this.matrix.addSquareToMatrix(d);
  this.grid.update(this.matrix.aliveCells(), this.currentCol);
  // this.grid.update(alive, this.currentCol);
}
