
var oscillator_waves = [
    "sine",
    "triangle",
    "sawtooth",
    "square",
]

var Instrument = function(type, context, decay) {
    this.type = type;
    this.context = context;
    if (this.type != "kick" && this.type != "snare") {
	if (this.type == "bass-synth") {
	    this.decay = randomInt(200,300)
	    this.wave_type = oscillator_waves[randomInt(0,4)];
	}
	else {
	    //this.decay = 200;
	    this.decay = randomInt(250,1200);
	    this.wave_type = oscillator_waves[randomInt(0,4)];
	    //this.wave_type = oscillator_waves[0];
	}

    }
    this.mute = false;
}

Instrument.prototype.play = function(number, freq) {
    if (this.type == "kick") {
	if (number == 1)
	    this.triggerKick(this.context.currentTime);
    }
    else if (this.type == "snare") {
	if (number == 1)
	    this.triggerSnare(this.context.currentTime);
    }
    else {
	this.playOscillator(freq, this.context);
    }
};

Instrument.prototype.setupOscillator = function() {
    this.attack = 100;
    this.gain = this.context.createGain();
    this.osc = this.context.createOscillator();
};

Instrument.prototype.setupKick = function() {
    this.osc = this.context.createOscillator();
    this.gain = this.context.createGain();
    this.osc.connect(this.gain);
    this.gain.connect(this.context.destination)
};
Instrument.prototype.noiseBuffer = function() {
    var bufferSize = this.context.sampleRate;
    var buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    var output = buffer.getChannelData(0);

    for (var i = 0; i < bufferSize; i++) {
	output[i] = Math.random() * 2 - 1;
    }
    return buffer;
};
Instrument.prototype.reverbBuffer = function() {
  var len = .5 * this.context.sampleRate,
      decay = 1;
  var buf = this.context.createBuffer(2, len, this.context.sampleRate);
  for (var c = 0; c < 2; c++) {
    var channelData = buf.getChannelData(c);
    for (var i = 0; i < channelData.length; i++) {
       channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
}
Instrument.prototype.oscillatorReverbBuffer = function() {
  var len = 100 * this.context.sampleRate,
      decay =.5;
  var buf = this.context.createBuffer(2, len, this.context.sampleRate);
  for (var c = 0; c < 2; c++) {
    var channelData = buf.getChannelData(c);
    for (var i = 0; i < channelData.length; i++) {
       channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
}
Instrument.prototype.setupSnare = function() {
    this.noise = this.context.createBufferSource();
    this.noise.buffer = this.reverbBuffer();
    var noiseFilter = this.context.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 100;
    this.noise.connect(noiseFilter);
    this.noiseEnvelope = this.context.createGain();
    noiseFilter.connect(this.noiseEnvelope);

    this.noiseEnvelope.connect(this.context.destination);
    
    this.osc = this.context.createOscillator();
    this.osc.type = 'triangle';

    this.oscEnvelope = this.context.createGain();
    this.osc.connect(this.oscEnvelope);
    this.oscEnvelope.connect(this.context.destination);
};

Instrument.prototype.triggerKick = function(time) {
    this.setupKick();

    this.osc.frequency.setValueAtTime(100, time);
    this.gain.gain.setValueAtTime(50, time);

    this.osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    this.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

    this.osc.start(time);

    this.osc.stop(time + 0.5);
};

Instrument.prototype.triggerSnare = function(time) {
    this.setupSnare();

    this.noiseEnvelope.gain.setValueAtTime(1, time);
    this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    this.noise.start(time)

    this.osc.frequency.setValueAtTime(100, time);
    this.oscEnvelope.gain.setValueAtTime(0.7, time);
    this.oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    this.osc.start(time)

    this.osc.stop(time + 0.2);
    this.noise.stop(time + 0.2);
};

Instrument.prototype.playOscillator = function(freq) {
    this.setupOscillator();
    /*
    this.noise = this.context.createBufferSource();
    this.noise.buffer = this.oscillatorReverbBuffer();
    var noiseFilter = this.context.createBiquadFilter();
    this.noise.connect(noiseFilter);
    this.noiseEnvelope = this.context.createGain();
    noiseFilter.connect(this.noiseEnvelope);
    this.noiseEnvelope.connect(this.context.destination);
    this.noiseEnvelope.gain.setValueAtTime(1, this.context.currentTime);
    this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);
    this.noise.start(this.context.currentTime)
    */
    this.gain.connect(this.context.destination);
    this.gain.gain.setValueAtTime(0, this.context.currentTime);
    this.gain.gain.linearRampToValueAtTime(1, this.context.currentTime + this.attack / 1000);
    this.gain.gain.linearRampToValueAtTime(0, this.context.currentTime + this.decay / 1000);

    this.osc.frequency.value = freq;
    this.osc.type = this.wave_type;
    this.osc.connect(this.gain);
    this.osc.start(0);

    this.osc.stop(this.context.currentTime + this.decay/1000)
    //this.osc.disconnect(this.gain);
    //this.gain.disconnect(this.context);
    /* doesn't really work
    setTimeout(function() {
        this.osc.stop(0);
        this.osc.disconnect(this.gain);
	this.gain.disconnect(this.context.destination);
    }, this.decay)
    */
};
