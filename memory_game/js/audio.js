class BackgroundMusic {
  constructor() {
    this.max_volume = 0.1;
    this.music = loadAudio('/memory_game/assets/Checkie_Brown_-_11_-_Wirklich_Wichtig_CB_27.mp3');
    this.music.loop = true;
    this.music.volume = this.max_volume;
  }

  get playing() {
    return !this.music.paused;
  }

  play() {
    if (this.playing) {
      return;
    } else {
      this.music.play();
    }
  }
}
