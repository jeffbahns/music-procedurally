//var Instrument = function(audio_context)
var Instrument = function(audio_context) {
    this.audio = audio_context;
    this.attack = 10,
    this.decay = 250,
    this.gain = this.audio.createGain(),
    this.osc = this.audio.createOscillator();
    this.gain.connect(this.audio.destination);
    this.gain.gain.setValueAtTime(0, this.audio.currentTime);
    this.gain.gain.linearRampToValueAtTime(1, this.audio.currentTime + this.attack / 1000);
    this.gain.gain.linearRampToValueAtTime(0, this.audio.currentTime + this.decay / 1000);

}

Instrument.prototype.play(freq) {
    this.osc.frequency.value = freq;
    this.osc.type = "square";
    this.osc.connect(this.gain);
    this.osc.start(0);
    setTimeout(function() {
        this.osc.stop(0);
        this.osc.disconnect(this.gain);
        this.gain.disconnect(this.audio.destination);
    }, this.decay)

}

function createOscillator1(freq, audio) {

    

}


