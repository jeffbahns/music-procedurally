var matrix = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
]

var Matrix = function(rows, cols, scale=randomScale()) {
    this.rows = rows;
    this.cols = cols;
    this.scale = scale;
    this.instruments = []
    for (i in rows) {
	var instrument = new Instrument("synth", context, 300);
	instrument.preset(0);
	instruments.push(instrument);
    }
}

Matrix.prototype.develop = function() {
    
}
