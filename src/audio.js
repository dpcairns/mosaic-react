// set initial state
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let oscillatorNodes = [];
let oscillatorGainNodes = [];
let muteBool = false;
const hexArray = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00];
// const hexArray = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00];

// reverb
let convolverTime = .3;
let convolverEffect = (function() {
    let convolver = audioCtx.createConvolver(),
        noiseBuffer = audioCtx.createBuffer(2, convolverTime * audioCtx.sampleRate, audioCtx.sampleRate),
        left = noiseBuffer.getChannelData(0),
        right = noiseBuffer.getChannelData(1);
        convolver.normalize = true;
    for (let i = 0; i < noiseBuffer.length; i++) {
        left[i] = Math.random() * 2 - 1;
        right[i] = Math.random() * 2 - 1;
    }
    convolver.buffer = noiseBuffer;
    return convolver;
})();

// lowpass filter
const biquadFilter = audioCtx.createBiquadFilter();
biquadFilter.type = "lowpass";
biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);

// initialize audio on componentDidMount
const audioStart = () => {
    audioCtx.resume();
    biquadFilter.connect(convolverEffect);
    convolverEffect.connect(audioCtx.destination);
};

// create new oscilatorNode
export const playAudio = (randomColor) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const addNode = oscillatorNodes.push(oscillator);
    const addGain = oscillatorGainNodes.push(gainNode);
    oscillatorNodes[addNode - 1].connect(gainNode);
    oscillatorGainNodes[addGain - 1].connect(convolverEffect);

    // set start of note
    !muteBool ? oscillatorGainNodes[addGain - 1].gain.linearRampToValueAtTime(.5, audioCtx.currentTime) : oscillatorGainNodes[addGain - 1].gain.setValueAtTime(0, audioCtx.currentTime);
    oscillatorNodes[addNode - 1].type = 'triangle';
    oscillatorNodes[addNode - 1].start(); 
    oscillatorNodes[addNode - 1].frequency.setValueAtTime(hexArray[randomColor], audioCtx.currentTime);
    
    // set end of note
    !muteBool ? oscillatorGainNodes[addGain - 1].gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 1) : oscillatorGainNodes[addGain - 1].gain.setValueAtTime(0, audioCtx.currentTime + 1);
    oscillatorNodes[addNode - 1].stop(audioCtx.currentTime + 1);
}

// suspend audio on componentWillUnmount
export const stopAudio = () => {
    audioCtx.suspend();   
}

// bool for muting audio
export const muteAudio = () => {
    muteBool = !muteBool;
}

export default audioStart;