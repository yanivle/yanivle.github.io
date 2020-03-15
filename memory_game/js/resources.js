// Assumes a div with id=loading 

let _resourcesToLoad = new Set();
_resourcesToLoad.add('window');
let _resourcesLoaded = new Set();

// This will be called once everything is loaded.
let onAllLoaded = null;

function loadAudio(url) {
  // console.log('Loading audio: ' + url);
  let audio = new Audio(url);
  audio.preload = 'auto';
  _resourcesToLoad.add(url);
  if (audio.readyState > 3) _advanceLoaded(url);
  audio.addEventListener('canplaythrough', function () { _advanceLoaded(url); }, { once: true });
  return audio;
}

function loadImage(url) {
  // console.log('Loading image: ' + url);
  let image = new Image();
  image.src = url;
  _resourcesToLoad.add(url);
  if (image.complete) {
    _advanceLoaded(url);
  } else {
    image.addEventListener('load', function () { _advanceLoaded(url); }, { once: true });
    image.addEventListener('error', function () {
      alert('Error loading image ' + url);
    }, { once: true });
  }
  return image;
}

function preloadImagesArray(urls_array) {
  for (const url of urls_array) {
    loadImage(url);
  }
}

function loadFont(font) {
  _resourcesToLoad.add(font);
  if (document.fonts.check(font)) {
    _advanceLoaded(font);
  } else {
    document.fonts.load(font).then(_advanceLoaded(font));
  }
}

function _advanceLoaded(url) {
  if (_resourcesLoaded.size == _resourcesToLoad.size) return; // already all loaded.
  _resourcesLoaded.add(url);
  let progressStr = 'Loading ' + (100 * _resourcesLoaded.size / _resourcesToLoad.size).toFixed(2) + '%...';
  // console.log(progressStr);
  document.getElementById('loading').innerText = progressStr;
  if (_resourcesLoaded.size == _resourcesToLoad.size) _allLoaded();
}

window.onload = function () {
  this._advanceLoaded('window');
}

function _allLoaded() {
  console.log('All resources loaded - starting!');
  document.getElementById('loading').style.display = 'none';
  if (onAllLoaded) onAllLoaded();
}
