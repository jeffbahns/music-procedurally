var MusicModel = function(context, seed, rows=8, cols=8) {
    this.rows = rows;
    this.cols = cols;
    this.context = context;
    this.instr = [];
    this.initializeInstruments();
    this.matrix = new Matrix(seed, rows, cols);
    //this.base_scale = new Scale('F', 'major-naturalminor', this.matrix.rows);
    this.base_scale = randomScale(this.matrix.rows);
    console.log(this.base_scale.notes)
}

MusicModel.prototype.play = function(matrix) {
    this.matrix = matrix;
    this.playInstruments3();
}

MusicModel.prototype.play = function(matrix, column) {
    this.matrix = matrix;
    this.playInstrumentsByColumn(column);
}

MusicModel.prototype.initializeInstruments = function() {
    this.instr.push(new Instrument("kick", this.context, 300));
    for (var i = 1; i < this.rows; i++) {
	var ins = new Instrument("leadsynth", this.context, 300);
	this.instr.push(ins);
    }
}

MusicModel.prototype.playInstrumentsByColumn = function(column) {
    var notes = Object.values(this.base_scale.notes)
    var num_notes = Object.values(this.base_scale.notes).length
    var to_play = this.matrix.rowsInColumn(column);
    for (var i = 0; i < to_play.length; i++) {
	console.log("THIS: ", Object.keys(this.base_scale.notes)[to_play[i]%num_notes])
	if (to_play[i] == 0) {
	    //this.instr[to_play[i]].play(1,1);
	} else {
	    this.instr[to_play[i]].play(-1, notes[to_play[i] % num_notes]);
	}
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
