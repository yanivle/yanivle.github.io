export class ResourceManager {
  constructor(assetsRoot = '', progressDivId = 'loading', onAllLoaded = null, verbose = false) {
    this.assetsRoot = assetsRoot;
    this.progressDivId = progressDivId;
    this._resourcesToLoad = new Set();
    this._resourcesToLoad.add('window');
    this._resourcesLoaded = new Set();
    this._audioResources = new Map();
    this._imageResources = new Map();
    this._fontResources = new Map();
    this.onAllLoaded = onAllLoaded;
    window.onload = () => {
      this._advanceLoaded('window');
    }
    this.verbose = verbose;
    this.shownErrorAlert = false;
  }

  log(...args) {
    if (this.verbose) console.log.apply(console, args);
  }

  error(...args) {
    console.error.apply(console, args);
    if (!this.shownErrorAlert) {
      alert('Unrecoverable error (check console for more): ' + args);
      this.shownErrorAlert = true;
    }
  }

  loadAudio(audioUrl, nickname = null) {
    if (this._audioResources.has(audioUrl) && !nickname) {
      return this._audioResources.get(audioUrl);
    }
    audioUrl = this.assetsRoot + audioUrl;
    let audio = null;
    if (this._audioResources.has(audioUrl)) {
      audio = this._audioResources.get(audioUrl);
      this.log('Loading audio from cache: ' + audioUrl);
    } else {
      this.log('Loading audio: ' + audioUrl);
      audio = new Audio(audioUrl);
      this._audioResources.set(audioUrl, audio);
      audio.preload = 'auto';
      this._resourcesToLoad.add(audioUrl);
      if (audio.readyState > 3) _advanceLoaded(audioUrl);
      audio.addEventListener('canplaythrough', () => { this._advanceLoaded(audioUrl); }, { once: true });
    }
    if (nickname) {
      if (this._audioResources.has(nickname)) {
        console.assert(this._audioResources.get(audioUrl) == this._audioResources.get(nickname),
          'Cannot reassign the same nickname to different resources', nickname, audioUrl);
      } else {
        this._audioResources.set(nickname, audio);
      }
    }
    return audio;
  }

  loadAudios(audioUrls) {
    let res = [];
    audioUrls.forEach(audioUrl => {
      res.push(this.loadAudio(audioUrl));
    });
    return res;
  }

  loadImage(imageUrl, nickname = null) {
    if (this._imageResources.has(imageUrl) && !nickname) {
      return this._imageResources.get(imageUrl);
    }
    imageUrl = this.assetsRoot + imageUrl;
    let image = null;
    if (this._imageResources.has(imageUrl)) {
      image = this._imageResources.get(imageUrl);
      this.log('Loading image from cache: ' + imageUrl);
    } else {
      this.log('Loading image: ' + imageUrl);
      image = new Image();
      this._imageResources.set(imageUrl, image);
      image.src = imageUrl;
      this._resourcesToLoad.add(imageUrl);
      if (image.complete) {
        this._advanceLoaded(imageUrl);
      } else {
        image.addEventListener('load', () => { this._advanceLoaded(imageUrl); }, { once: true });
        image.addEventListener('error', () => {
          this.error('Error loading image ' + imageUrl);
        }, { once: true });
      }
    }
    if (nickname) {
      if (this._imageResources.has(nickname)) {
        console.assert(this._imageResources.get(imageUrl) == this._imageResources.get(nickname),
          'Cannot reassign the same nickname to different resources', nickname, imageUrl);
      } else {
        this._imageResources.set(nickname, image);
      }
    }

    return image;
  }

  loadImages(imageUrls) {
    let res = [];
    imageUrls.forEach(imageUrl => {
      res.push(this.loadImage(imageUrl));
    });
    return res;
  }

  loadFont(fontName, fontUrl, nickname = null) {
    if (this._fontResources.has(fontUrl) && !nickname) {
      return this._fontResources.get(fontUrl);
    }
    fontUrl = this.assetsRoot + fontUrl;
    let fontFace = null;
    if (this._fontResources.has(fontUrl)) {
      fontFace = this._fontResources.get(fontUrl);
      this.log('Loading font face from cache: ' + fontUrl);
    } else {
      this.log('Loading font face: ' + fontUrl);
      this._resourcesToLoad.add(fontUrl);
      fontFace = new FontFace(fontName, 'url(' + fontUrl + ')');
      fontFace.load().then((loadedFontFace) => {
        document.fonts.add(loadedFontFace);
        this._advanceLoaded(fontUrl);
      });
    }
    if (nickname) {
      if (this._fontResources.has(nickname)) {
        console.assert(this._fontResources.get(fontUrl) == this._fontResources.get(nickname),
          'Cannot reassign the same nickname to different resources', nickname, fontUrl);
      } else {
        this._fontResources.set(nickname, fontFace);
      }
    }
    return fontFace;
  }

  _advanceLoaded(url) {
    if (this._resourcesLoaded.size == this._resourcesToLoad.size) return; // already all loaded.
    this._resourcesLoaded.add(url);
    if (this.progressDivId) {
      let progressStr = 'Loading ' + (100 * this._resourcesLoaded.size / this._resourcesToLoad.size).toFixed(2) + '%...';
      this.log(progressStr);
      document.getElementById(this.progressDivId).innerText = progressStr;
    }
    if (this._resourcesLoaded.size == this._resourcesToLoad.size) this._allLoaded();
  }

  resourcesRemaining() {
    return new Set([...this._resourcesToLoad].filter(resource => !this._resourcesLoaded.has(resource)));
  }

  _allLoaded() {
    this.log('All resources loaded!');
    if (this.progressDivId) {
      document.getElementById(this.progressDivId).style.display = 'none';
    }
    if (this.onAllLoaded) this.onAllLoaded();
  }
}

