var Sequence = function(bar_length, scale) {
    this.bar_length = bar_length;
    this.scale = scale;
    this.seq = this.generateRandomSequence();
};

Sequence.prototype.generateRandomSequence = function() {
    var seq = "";
    for (var i = 0; i < this.bar_length; i++) {
	randominty = randomInt(0, Object.keys(this.scale.notes).length);
	seq += randominty;
    }
    return seq;
}

// changes length of sequence and regenerates
Sequence.prototype.changeLength = function(bar_length) {
    this.bar_length = bar_length;
    this.generateRandomSequence();
}

// changes scale and regenerates
Sequence.prototype.changeScale = function(scale) {
    this.bar_length = bar_length;
    this.generateRandomSequence();
}
// changes length of sequence and scale, and regenerates
Sequence.prototype.changeLengthAndScale = function(scale) {
    this.scale = scale;
    this.generateRandomSequence();
}

