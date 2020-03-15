function filename(url) {
  return url.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, "");
}

function removeByValueInplace(array, element) {
  var index = array.indexOf(element);
  if (index !== -1) array.splice(index, 1);
}
