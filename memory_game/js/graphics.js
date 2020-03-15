function renderToTexture(width, height, drawOnContextFunction) {
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  let context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawOnContextFunction(context);
  let dataURL = canvas.toDataURL();
  let image = new Image(width, height);
  image.src = dataURL;
  return image;
}

function resizeImage(image, width, height) {
  return renderToTexture(width, height, context => {
    context.drawImage(image, 0, 0, width, height);
  });
}

function createCheckerboardImage(cell_size = 4) {
  return renderToTexture(64, 64, context => {
    for (let x = 0; x < 64; x += cell_size) {
      for (let y = 0; y < 64; y += cell_size) {
        if ((x + y) % (cell_size * 2) == 0) {
          context.fillStyle = '#FFF';
        } else {
          context.fillStyle = '#C9C9C9';
        }
        context.fillRect(x, y, cell_size, cell_size);
      }
    }
  });
}

function debugImage(image, label = null) {
  // var background = createCheckerboardImage();
  var parent = document.getElementById("debug_area");
  // let composite = renderToTexture(context => {
  //   context.drawImage(background, 0, 0);
  //   context.drawImage(image, 0, 0);
  // });
  // parent.appendChild(composite);
  if (label) {
    let p = document.createElement('span');
    p.innerText = label;
    parent.appendChild(p);
  }
  parent.appendChild(image);
}
