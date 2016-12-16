var notes = {
    'A':  440,
    'A#': 466.16,
    'B':  493.88,
    'C':  523.25,
    'C#': 554.37,
    'D':  587.33,
    'D#': 622.25,
    'E':  659.25,
    'F':  698.46,
    'F#': 739.99,
    'G':  783.99,
    'G#': 830.61
}

var scales = {
    'major': [0, 2, 4, 5, 7, 9, 11],
    'minor': [0, 2, 3, 5, 7, 8, 10],
    'minor-pentatonic': [0, 3, 5, 7, 10],
    'major-pentatonic': [0, 2, 4, 7, 9]
}

function randomInt(min_range, max_range) {
    return Math.floor(Math.random() * (max_range-min_range)) + min_range;
}

function randomRootNote() {
    var randomNoteIndex = randomInt(0, Object.keys(notes).length);
    return Object.keys(notes)[randomNoteIndex];
}

function randomScaleType() {
    var randomScaleIndex = randomInt(0, Object.keys(scales).length);
    return Object.keys(scales)[randomScaleIndex];
}