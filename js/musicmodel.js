var MusicModel = function(context, rows=8, cols=8) {
    this.rows = rows;
    this.cols = cols;
    this.context = context;
    this.instr = [];
    this.initializeInstruments();
    this.matrix = new Matrix(rows, cols);
    this.base_scale = new Scale('A', 'major');
}

MusicModel.prototype.play = function(matrix) {
    this.matrix = matrix;
    this.playInstruments3();
}

MusicModel.prototype.initializeInstruments = function() {
    for (var i = 0; i < this.cols; i++) {
	var ins = new Instrument("leadsynth", this.context, 300);
	this.instr.push(ins);
    }
}

MusicModel.prototype.playInstruments = function() {
    var num_notes = Object.values(this.base_scale.notes).length
    for (var i = 0; i < this.cols; i++) {
	if (!this.matrix.colEmpty(i)) {
	    var note = Object.values(this.base_scale.notes)[i % num_notes];
	    this.instr[i].play(-1, note);
	    console.log(this.instr[i]);
	}
    }
}

MusicModel.prototype.playInstruments2 = function() {
    var num_notes = Object.values(this.base_scale.notes).length
    if (!this.matrix.colEmpty(0)) {
	var note = Object.values(this.base_scale.notes)[0];
	this.instr[i].play(-1, note);
	console.log(this.instr[i]);
    }
}

// play all the edges that are alive
MusicModel.prototype.playInstruments3 = function() {
    var rowEdges = this.matrix.rowEdges();
    var colEdges = this.matrix.colEdges();
    var edges = concatArraysUniqueWithSort(rowEdges, colEdges)
    console.log(edges);
    var notes = Object.values(this.base_scale.notes)
    var num_notes = Object.values(this.base_scale.notes).length
    for (i = 0; i < edges.length; i++) {
	this.instr[edges[i]].play(-1,notes[edges[i]%num_notes]);
    }
}
