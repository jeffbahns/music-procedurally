/*,instrument*/
var Role = function(scale, sequence, context, instrument) {
    this.type = instrument.type;
    this.context = context;
    this.scale = scale;
    this.sequence = sequence;
    this.instrument = instrument;
    this.mute = false;
};

Role.prototype.play = function(position) {
    var number = this.sequence.seq.charAt(position);
    var note = Object.keys(this.scale.notes)[number];
    var freq = this.scale.notes[note];

    // if there is a rest note, undefined because note search blows up
    if (note == undefined || this.mute) {
        // dont do shit
        return;
    }
    this.instrument.play(number, freq);
}

Role.prototype.playNote = function(note) {
    this.instrument.play(-1, note)
}

Role.prototype.display = function() {
    display = '';
    //display += '<input id=' + this.type + ' type=checkbox><label></label>'
    display += '<b>Instrument:</b> ' + this.type;
    return display;
}

Role.prototype.regenerateSequence = function() {
    console.log("Old : " + this.sequence.seq);
    this.sequence.seq = this.sequence.generateRandomSequence();
    console.log("New : " + this.sequence.seq);
}

Role.prototype.regenerateInstrument = function() {
    console.log("regenerating " + this.instrument.type);
    this.instrument = new Instrument(this.type, this.context);
}

Role.prototype.mutes = function() {
    console.log("muting " + this.type);
    this.mute = !this.mute;
}
