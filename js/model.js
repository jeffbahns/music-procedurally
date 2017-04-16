var Model = function(context, rows=8, cols=8) {
    this.rows = rows;
    this.cols = cols;
    this.context = context;
    this.instr = [];
    this.matrix = new Matrix(rows, cols);
    this.grid = new MusicGrid(rows, cols);
    this.grid.drawGrid();
    //this.initializeInstruments();
}

Model.prototype.initializeInstruments = function() {
    //TODO: should be based on a model
    var i = new Instrument("leadsynth", context, 300);
    this.instr.push([i, 440]);
}

Model.prototype.progress = function() {
    var one = [[0,0]];
    var two = [[0,9]];
    var three = [[9,0]];
    var four = [[9,9]];
    alive = this.matrix.progress();
    this.grid.update(alive);
}
