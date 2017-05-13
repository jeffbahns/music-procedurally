var Model = function(context, seed, rows = 8, cols = 8) {
    this.context = context;
    this.seed = seed % 512;
    
    this.rows = rows;
    this.cols = cols;

    this.matrix = new Matrix(rows, cols);
    this.musicModel = new MusicModel(context, rows, cols);
    this.grid = new MusicGrid(rows, cols);
    this.grid.drawGrid();
    this.currentCol = 0;
    this.progress();
}

Model.prototype.play = function() {
    if (this.currentCol == this.cols) {
        this.progress();
        this.currentCol = 0;
    }
    this.grid.update(alive, this.currentCol);
    this.musicModel.play(this.matrix, this.currentCol);
    this.currentCol += 1;
    console.log("current col ", this.currentCol)
}

Model.prototype.progress = function() {
    alive = this.matrix.progress();
    this.grid.update(alive, this.currentCol);
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
