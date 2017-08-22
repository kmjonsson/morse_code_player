
interface CwMap {
	[key: string] : string
}

export class MorsePlayer {
	private context: AudioContext;
	private freq: number;
	private dit: number;
	private silence_dit: number;
	private t: number;
	private volume: number;
	private cw_map: CwMap = {
		// Letters
		"A": ".-",
		"B": "-...",
		"C": "-.-.",
		"D": "-..",
		"E": ".",
		"F": "..-.",
		"G": "--.",
		"H": "....",
		"I": "..",
		"J": ".---",
		"K": "-.-",
		"L": ".-..",
		"M": "--",
		"N": "-.",
		"O": "---",
		"P": ".--.",
		"Q": "--.-",
		"R": ".-.",
		"S": "...",
		"T": "-",
		"U": "..-",
		"V": "...-",
		"W": ".--",
		"X": "-..-",
		"Y": "-.--",
		"Z": "--..",
		// Numbers
		"0": "-----",
		"1": ".----",
		"2": "..---",
		"3": "...--",
		"4": "....-",
		"5": ".....",
		"6": "-....",
		"7": "--...",
		"8": "---..",
		"9": "----.",
		// Special
		" ": " ",
		"?": "..--..",
		"/": "-..-.",
		",": "--..--",
		"-": "-....-",
		".": ".-.-.-",
		"@": "...-.-",
		"+": ".-.-.",
		"~": "-.-.-",
		"=": "-...-",
	};
	constructor(ctx: AudioContext, freq: number, wpm: number, farnsworth_wpm?: number) {
		this.context = ctx;
		this.freq = freq;
		this.wpm(wpm);
		this.fransworth(farnsworth_wpm);
		this.t = this.context.currentTime;
	}
	add(char : string, cw: string) {
		// TODO check for valid info
		this.cw_map[char.toUpperCase()] = cw;
	}
	wpm(wpm: number) {
		this.dit = 60 / (wpm * 50);	// PARIS
		this.silence_dit = this.dit;
	}
	fransworth(fransworth_wpm: number) {
		if(fransworth_wpm === undefined) {
			this.silence_dit = this.dit;
		} else {
			// Calculate the inter char silence length to match fransworth WPM
			this.silence_dit = (60 / fransworth_wpm - 36 * this.dit) / 14;
		}
	}
	set_volume(vol: number) {
		if(vol < 0) {
			vol = 0;
		}
		if(vol > 100) {
			vol = 100;
		}
		this.volume = vol/100.0;
	}
	get_volume(): number {
		return this.volume * 100;
	}
	play(text: string):number {
		if(this.t > this.context.currentTime) {
			this.silence(4);
		} else {
			this.t = this.context.currentTime+0.21;
		}
		for(let c of text.toUpperCase().split("")) {
			if(!this.cw_map[c]) {
				continue;
			}
			for(let p of this.cw_map[c].split("")) {
				if(p == '-') { this.play_do(3); }
				if(p == '.') { this.play_do(); }
				if(p == ' ') { this.char_silence(4); }
				this.silence();
			}
			this.char_silence(2);
		}
		return this.t - this.context.currentTime - this.dit - this.silence_dit*2;
	}
	private play_do(n: number=1) {
		let o = this.context.createOscillator();
		o.frequency.value = this.freq;
		o.start(this.t);
		o.stop(this.t+n*this.dit);
		let gainNode = this.context.createGain();
		gainNode.gain.value = this.volume*this.volume;
		o.connect(gainNode);
		gainNode.connect(this.context.destination);
		this.t += n*this.dit;
	}
	private silence(n:number=1) {
		this.t += this.dit*n;
	}
	private char_silence(n:number=1) {
		this.t += this.silence_dit*n;
	}
}
