var Model = function(rows, cols, context) {
    this.rows = rows;
    this.cols = cols;
    this.context = context;
    this.instr = [];
    this.matrix = Matrix(rows, cols);

    this.initializeInstruments();
}

Model.prototype.initializeInstruments() {
    //TODO: should be based on a model
    var i = new Instrument("leadsynth", context, 300);
    this.instr.push([i, 440]);
}

