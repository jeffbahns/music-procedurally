var Model = function(context, rows=8, cols=8) {
    this.rows = rows;
    this.cols = cols;
    this.context = context;
    this.instr = [];
    this.matrix = new Matrix(rows, cols);
    this.grid = new MusicGrid(rows, cols);
    this.grid.drawGrid();
    this.musicModel = new MusicModel(context, rows, cols);
}

Model.prototype.progress = function() {
    alive = this.matrix.progress();
    this.grid.update(alive);
    this.musicModel.play(this.matrix);
}
