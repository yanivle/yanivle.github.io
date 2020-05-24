export class AudioArray {
  // Either pass a single url string and int channels, or an array of urls.
  constructor(urls, channels = null) {
    if (channels) {
      urls = new Array(channels).fill(urls);
    } else {
      channels = urls.length;
    }
    this.urls = urls;
    this.channels = channels;
    this.audios = [];
    this.i = 0;
    for (let i = 0; i < channels; ++i) this.audios.push(resource_manager.loadAudio(urls[i]).cloneNode());
  }

  play(volume = 1) {
    this.audios[this.i].volume = volume;
    this.audios[this.i].play();
    if (++this.i == this.channels) this.i = 0;
  }
}
