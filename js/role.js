/*,instrument*/
var Role = function(scale, sequence, audio_context, instrument) {
    this.type = instrument.type;
    this.scale = scale;
    this.sequence = sequence;
    this.instrument = instrument;
};

Role.prototype.play = function(position) {
    var number = this.sequence.seq.charAt(position);
    var note = Object.keys(this.scale.notes)[number];
    var freq = this.scale.notes[note];

    // if there is a rest note, undefined because note search blows up
    if (note == undefined) {
	// dont do shit
	//console.log("(" + note + " : " + freq + ")");
	return ;
    }
    this.instrument.play(number, freq);
    //createOscillator1(freq, this.audio_context);
}

Role.prototype.display = function() {
    display = '';
    display += '<b>Instrument:</b> ' + this.type + '</br>';
    return display;
}
