/*,instrument*/
var Role = function(scale, sequence, audio_context ) {
    this.scale = scale;
    this.sequence = sequence
    this.audio_context = audio_context;
    //this.instrument = instrument
};

Role.prototype.play = function(position) {
    var note = Object.keys(this.scale.notes)[this.sequence.seq.charAt(position)]
    var freq = this.scale.notes[note];
    if (note != undefined) {
	// dont do shit
	//console.log("(" + note + " : " + freq + ")");
	//return ;
    }
    createOscillator1(freq, this.audio_context);
}
