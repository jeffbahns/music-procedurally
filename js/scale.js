// scale
var notes = {
    'A': 440,
    'A#': 466.16,
    'B': 493.88,
    'C': 523.25,
    'C#': 554.37,
    'D': 587.33,
    'D#': 622.25,
    'E': 659.25,
    'F': 698.46,
    'F#': 739.99,
    'G': 783.99,
    'G#': 830.61
}

var scales = {
    'chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    'major': [0, 2, 4, 5, 7, 9, 11],
    'minor-natural': [0, 2, 3, 5, 7, 8, 10],
    'minor-harmonic': [0, 2, 3, 5, 7, 8, 11],
    'minor-melodic': [0, 2, 3, 5, 7, 9, 11],
    'minor-pentatonic': [0, 3, 5, 7, 10],
    'major-pentatonic': [0, 2, 4, 7, 9]
}

// scale class, takes a root note and type of scale
// generates and stores all the notes associated with the class
var Scale = function(root_note, type, size=5) {
    this.root_note = root_note;
    this.type = type;
    this.size = size;
    this.notes = this.generateScale();

};

// from the root note of the scale and what type of scale it is,
// this function creates the member dictionary that contains the notes
// that only pertain to this exact scale
Scale.prototype.generateScale = function() {
    console.log("building scale...");
    var scale = {}
    var scale_steps = scales[this.type];
    var root_index = Object.keys(notes).indexOf(this.root_note);

    // use root index and steps to build scale
    var iter = Math.ceil(this.size / scale_steps.length);
    
    for (var i = -1; i < iter-1; i++) {
	//console.log(Object.keys(scale).length, this.size);
	for (var j = 0; j < scale_steps.length && Object.keys(scale).length < this.size; j++) {
	    var note_index = (root_index + scale_steps[j]) %  Object.keys(notes).length;
	    scale[Object.keys(notes)[note_index]+(i.toString())] = notes[Object.keys(notes)[note_index]]*Math.pow(2,i);
	}
    }
    console.log(scale);
    return scale;
};

// drop every note by an octave, essentially is the exact same notes, just lower pitch
Scale.prototype.dropOctave = function() {
    for (var note in Object.keys(this.notes)) {
        this.notes[Object.keys(this.notes)[note]] *= .5;
    }
    return this;
}

// same as drop, but raises octave
Scale.prototype.raiseOctave = function() {
    for (var note in Object.keys(this.notes)) {
        this.notes[Object.keys(this.notes)[note]] *= 2;
    }
    return this;
}

// length of scale
Scale.prototype.sizeFunc = function() {
    return this.size;
    //return Object.keys(this.notes).length;
}

// find the note
Scale.prototype.findNoteByChar = function(input_note) {
    notes_in_scale = Object.keys(this.notes);
    if (input_note == '-')
        return;
    for (var note in notes_in_scale) {
        //console.log("note_to_search : " + notes_in_scale[note] + " shit note: " + input_note)
        if (notes_in_scale[note] == input_note) {
            return notes_in_scale[note]
        }
    }
}
// find the note
Scale.prototype.findNoteByIndex = function(index) {
    return this.notes[index];
}

// helpful for debugging
Scale.prototype.print = function() {
    console.log("I am " + this.root_note + " " + this.type);
    console.log("This structure contains my notes");
    console.log(this.notes);
}
