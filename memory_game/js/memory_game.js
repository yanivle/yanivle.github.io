
class Card extends Sprite {
  constructor(url) {
    super(loadImage(url), new Vec2());

    this.faceUp = false;
    this.wigglers = [];
    this.backsideImage = loadImage(cardBackUrl);
  }

  start() {
    let wiggler = new PropertyWiggler(this, 'width', 1, 3);
    this.wigglers.push(wiggler);
    addObject(wiggler);

    wiggler = new PropertyWiggler(this, 'left', 1, -1.5, wiggler.phase);
    this.wigglers.push(wiggler);
    addObject(wiggler);

    mouse.addClickHandler(this);
  }

  end() {
    this.wigglers.forEach(wiggler => destroyObject(wiggler));
    mouse.removeClickHandler(this);
  }

  draw() {
    if (this.faceUp) {
      Sprite.prototype.draw.call(this);
    } else {
      context.drawImage(this.backsideImage, this.left, this.top, this.width, this.height);
      // context.fillStyle = 'rgb(0, 0, 255)';
      // context.fillRect(this.left, this.top, this.width, this.height);
    }
  }

  get type() {
    return this.image.src;
  }

  click() {
    if (this.contains(mouse.pos)) {
      if (!this.faceUp) {
        if (level.faceUpCards().length < level.countForEachCard) {
          this.faceUp = true;
        }
      }
    }
  }
}

const card_urls = [
  '/memory_game/assets/Virus1-01.png',
  '/memory_game/assets/Virus2-01.png',
  '/memory_game/assets/Virus3-01.png',
  '/memory_game/assets/Virus4-01.png',
  '/memory_game/assets/Virus5-01.png',
  '/memory_game/assets/Virus6-01.png'];
preloadImagesArray(card_urls);
const cardBackUrl = '/memory_game/assets/cardback.png';
loadImage(cardBackUrl);
const syringeUrl = '/memory_game/assets/syringe.png';
loadImage(syringeUrl);
const backgroundImage = loadImage('/memory_game/assets/hospital.jpg');
const maskImage = loadImage('/memory_game/assets/mask.jpg');
loadImage('/memory_game/assets/star.png');
loadImage('/memory_game/assets/easy.png');
loadImage('/memory_game/assets/hard.png');
loadImage('/memory_game/assets/super_hard.png');
loadImage('/memory_game/assets/corona.png');
loadImage('/memory_game/assets/main_menu.png');
loadImage('/memory_game/assets/cloud.png');

class Button extends Sprite {
  constructor(url, pos, callback) {
    super(loadImage(url), pos);
    this.width = 128;
    this.height = 128;
    this.callback = callback;
  }
  start() {
    mouse.addClickHandler(this);
  }

  end() {
    mouse.removeClickHandler(this);
  }

  click() {
    if (this.contains(mouse.pos)) {
      sounds.whoosh.play();
      this.callback();
    }
  }
}

class MainMenu {
  constructor(max_level = 0) {
    this.max_level = max_level;
  }

  addChild(child) {
    this.children.push(child);
    addObject(child);
  }

  addButton(url, pos, countForEachCard, shuffleProb, moveTime) {
    let button = new Button(url, pos, () => {
      let ps = new ParticleSystem(['/memory_game/assets/star.png'], 10, mouse.pos);
      addObject(ps, { layer: 3, duration: 2 });
      this.startGame(countForEachCard, shuffleProb, moveTime);
    });
    this.addChild(button);
    let xWiggler = new PropertyWiggler(button, 'width', 1, 20);
    this.addChild(xWiggler);
    let yWiggler = new PropertyWiggler(button, 'height', 1, 20);
    this.addChild(yWiggler);
  }

  start() {
    this.children = [];
    this.addButton('/memory_game/assets/easy.png', new Vec2(40, 40), 2, 0, 0);
    this.addChild(new UIText('2 of a kind', new Vec2(300, 100), 20, 'purple', false));
    if (this.max_level == 0) {
      this.addChild(new UIText('Beat Easy mode to unlock next level!', new Vec2(40, 100 + 200), 60, 'lightblue', false));
      return;
    }
    this.addButton('/memory_game/assets/hard.png', new Vec2(40, 40 + 200), 3, 1 / 600, 0.1);
    this.addChild(new UIText('3 of a kind', new Vec2(300, 100 + 200), 20, 'lightblue', false));
    if (this.max_level == 1) {
      this.addChild(new UIText('Beat Hard mode to unlock next level!', new Vec2(40, 100 + 400), 60, 'orange', false));
      return;
    }
    this.addButton('/memory_game/assets/super_hard.png', new Vec2(40, 40 + 400), 4, 1 / 300, 0.5);
    this.addChild(new UIText('4 of a kind', new Vec2(300, 100 + 400), 20, 'orange', false));
    if (this.max_level == 2) {
      this.addChild(new UIText('Beat Super Hard mode to unlock next level!', new Vec2(40, 100 + 600), 60, 'green', false));
      return;
    }
    this.addButton('/memory_game/assets/corona.png', new Vec2(40, 40 + 600), 5, 1 / 60, 2);
    this.addChild(new UIText('???', new Vec2(300, 100 + 600), 20, 'green', false));
  }

  startGame(countForEachCard, shuffleProb, moveTime) {
    destroyObject(this);
    level = new Level(countForEachCard, shuffleProb, moveTime);
  }

  draw() {
    context.drawImage(maskImage, 0, 0, canvas.width, canvas.height);
  }

  end() {
    destroyObjects(this.children);
  }
}

const sounds = {
  whoosh: loadAudio('/memory_game/assets/whoosh.wav'),
  applause: loadAudio('/memory_game/assets/applause.wav'),
  buzzer: loadAudio('/memory_game/assets/buzzer.mp3'),
  cough: loadAudio('/memory_game/assets/cough.mp3'),
}
sounds.cough.volume = 0.1;
sounds.buzzer.volume = 0.1;
sounds.applause.volume = 0.1;

class Mover {
  constructor(object, property, target, time) {
    this.object = object;
    this.property = property;
    this.target = target;
    this.time = time;
    this.vel = (target - object[property]) / time;
  }

  update(delta_time) {
    this.object[this.property] = this.object[this.property] + this.vel * delta_time;
  }
}

class Level {
  constructor(countForEachCard, shuffleProb = 0, moveTime = 0) {
    this.countForEachCard = countForEachCard;
    this.shuffleProb = shuffleProb;
    this.moveTime = moveTime;
    this.cards = [];
    addObject(this, { layer: 0 });

    this.turns = 0;
    this.turnsText = new UIText('0 Turns', new Vec2(50, 50), 20, 'black', false);
    addObject(this.turnsText, { layer: 3 });
    this.paused = false;

    this.init();

    this.buttonToMainMenu = new Button('/memory_game/assets/main_menu.png', new Vec2(canvas.width - 200, 40), () => {
      this.toMainMenu();
    });
    this.buttonToMainMenu.height = 64;
    addObject(this.buttonToMainMenu);

    if (countForEachCard == 5) addClouds();
  }

  end() {
    removeClouds();
    destroyObjects([this.buttonToMainMenu, this.turnsText]);
    destroyObjects(this.cards);
  }

  draw() {
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }

  badMove(faceUpCards) {
    this.paused = true;
    sounds.cough.play();
    // let text = new UIText('WRONG!', new Vec2(canvas.width / 2, 200), 32, 'red');
    // addObject(text, { layer: 3, duration: 2 });

    this.turnsText.color = 'red';
    this.turnsText.fontSize = 40;
    setTimeout(() => {
      this.turnsText.color = 'black';
      this.turnsText.fontSize = 20;
    }, 2000);

    setTimeout(() => {
      faceUpCards.forEach(card => card.faceUp = false);
      this.paused = false;
    }, 1000);

    this.turns++;
    this.turnsText.text = this.turns + ' Turns';
  }

  gotIt(faceUpCards) {
    this.paused = true;
    if (this.cards.length > 0) {
      let text = new UIText('Good job!', new Vec2(canvas.width / 2, 400), 32, 'green');
      addObject(text, { layer: 3, duration: 2 });
    }

    let ps = new ParticleSystem(['/memory_game/assets/star.png'], 10, mouse.pos);
    addObject(ps, { layer: 3, duration: 5 });

    sounds.applause.play();

    setTimeout(() => {
      faceUpCards.forEach(card => { removeByValueInplace(this.cards, card); destroyObject(card) });
      this.paused = false;
      if (this.cards.length == 0) {
        let text = new UIText('You win! It took you ' + this.turns + ' turns!', new Vec2(canvas.width / 2, 400), 32, 'green');
        addObject(text, { layer: 3, duration: 5 });
        addObject(new ParticleSystem(['/memory_game/assets/star.png'], 10, new Vec2(canvas.width / 3, 400)), { layer: 3, duration: 5 });
        addObject(new ParticleSystem(['/memory_game/assets/star.png'], 10, new Vec2(canvas.width / 2, 400)), { layer: 3, duration: 5 });
        addObject(new ParticleSystem(['/memory_game/assets/star.png'], 10, new Vec2(canvas.width * 2 / 3, 400)), { layer: 3, duration: 5 });

        setTimeout(() => {
          max_level++;
          this.toMainMenu();
        }, 5);
      }
    }, 1000);
  }

  toMainMenu() {
    destroyObject(this);
    addObject(new MainMenu(max_level));
  }

  faceUpCards() {
    return this.cards.filter(card => card.faceUp);
  }

  update() {
    if (this.paused) return;
    if (Math.random() < this.shuffleProb) {
      let card = randElement(this.cards);
      addObject(new Mover(card, 'top', randRange(50, canvas.height - card.height - 50), this.moveTime), { duration: this.moveTime });
    }
    let faceUpCards = this.faceUpCards();
    if (faceUpCards.length == 0) return;
    for (let i = 1; i < faceUpCards.length; ++i) {
      if (faceUpCards[i].type != faceUpCards[0].type) {
        this.badMove(faceUpCards);
        return;
      }
    }
    if (faceUpCards.length == this.countForEachCard) {
      this.gotIt(faceUpCards);
    }
  }

  isWellPlaced(card) {
    for (let i = 0; i < this.cards.length; ++i) {
      const other = this.cards[i];
      if (card == other) continue;
      if (card.intersects(other)) return false;
    }
    return true;
  }

  randomizeCardLocation(card) {
    const margin = 100;
    card.pos.x = randRange(margin, canvas.width - card.width - margin);
    card.pos.y = randRange(margin, canvas.height - card.height - margin);
  }

  placeCard(card) {
    while (!this.isWellPlaced(card)) this.randomizeCardLocation(card);
  }

  init() {
    this.turns = 0;
    this.turnsText.text = this.turns + ' Turns';

    for (const url of card_urls) {
      for (let i = 0; i < this.countForEachCard; ++i) {
        let card = new Card(url);
        card.width = card.height = 64;
        this.cards.push(card);
      }
    }

    this.cards.forEach(card => this.randomizeCardLocation(card));

    this.cards.forEach(card => this.placeCard(card));

    this.cards.forEach(card => addObject(card));
  }
}

let bg_music = new BackgroundMusic();

let level = null;
onAllLoaded = function () {
  document.getElementById('main').style.display = 'block';
}

function fullScreen() {
  console.log('switching to fullscreen...');
  canvas.style.display = 'block';
  if (canvas.webkitRequestFullScreen) {
    canvas.webkitRequestFullScreen();
  } else {
    canvas.mozRequestFullScreen();
  }
}

class MainMenuOnExit {
  start() {
    keyboard.addKeyDownkHandler(this);
  }

  keyDown() {
    if (keyboard.keysDown[27]) {
      resetGame();
    }
  }
}

let clouds = [];
function removeClouds() {
  destroyObjects(clouds);
}
function addClouds() {
  const numClouds = 5;
  clouds = new Array(numClouds);
  for (let i = 0; i < numClouds; ++i) {
    let cloud = new Sprite(loadImage('/memory_game/assets/cloud.png'), new Vec2());
    clouds.push(cloud);
    addObject(cloud, { layer: 3 });
    cloud.center = new Vec2(canvas.width / 2, canvas.height / 2).add(noiseVec2(200));
    addObject(new PropertyWiggler(cloud, 'left', 1 / 2, 500));
    addObject(new PropertyWiggler(cloud, 'top', 1 / 2, 500));
  }
}

function resetGame() {
  destroyAllObjects();
  addObject(mouse, { layer: 4 });
  addObject(new MainMenu(max_level));
  addObject(new MainMenuOnExit());
}

function start() {
  fullScreen();
  bg_music.play();
  mouse.setCursorToImage(loadImage(syringeUrl));
  resetGame();
  main();
}
document.getElementById('start').addEventListener("click", start);

let max_level = 0;