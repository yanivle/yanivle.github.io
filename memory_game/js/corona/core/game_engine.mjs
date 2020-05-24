import { System } from '../ecs/system.mjs';
import { removeByValueInplace } from './util.mjs';
import { canvas, createCanvas } from './canvas.mjs';
import { Mouse } from './mouse.mjs';
import { Keyboard } from './keyboard.mjs';
import { Debug } from './debug.mjs';
import { entity_db } from '../ecs/entity_database.mjs';
import { resizeHandler } from './canvas.mjs';
import { SceneManager } from './scene_manager.mjs';
import { event_manager } from './EventManager.mjs';

export let mouse = null;
export let keyboard = null;

class GameEngine {
  #timeStart = GameEngine._timestamp();
  #now = GameEngine._timestamp();
  scene_manager = new SceneManager();

  static _timestamp() {
    return performance.now() / 1000;
  }

  startScene(sceneName) {
    this.scene_manager.startScene(sceneName);
  }

  addScene(sceneName, scene) {
    this.scene_manager.addScene(sceneName, scene);
  }

  constructor() {
    this.reset();
    this.running = false;
    this.debugFPS = new Debug();
    this.debugNumEntities = new Debug();
    this.debugNumSystems = new Debug();
    // this.debugMousePos = new Debug();
    window.game_engine = this;
    window.entity_db = entity_db;
  }

  reset() {
    entity_db.reset();
    this.systems = [];
    this.systemsScheduledForAddition = [];
    this.systemsScheduledForRemoval = [];
  }

  get now() {
    return this.#now - this.#timeStart;
  }

  addSystem(system) {
    this.systemsScheduledForAddition.push(system);
  }

  _actuallyAddSystem(system) {
    console.assert(system instanceof System, system);
    this.systems.push(system);
    if (this.running) system.init();
  }

  removeSystem(system) {
    this.systemsScheduledForRemoval.push(system);
  }

  init(width, height) {
    createCanvas(width, height);
    mouse = new Mouse();
    keyboard = new Keyboard();
    this.systems.forEach(system => system.init());
    this.scene_manager.init();
  }

  static fullScreen() {
    console.log('Switching to fullscreen...');
    if (canvas.webkitRequestFullScreen) {
      canvas.webkitRequestFullScreen();
    } else {
      canvas.mozRequestFullScreen();
    }
  }

  postUpdate() {
    mouse.postUpdate();
    keyboard.postUpdate();
    resizeHandler.postUpdate();

    this.systemsScheduledForRemoval.forEach(system => { removeByValueInplace(this.systems, system) });
    this.systemsScheduledForRemoval = [];

    this.systemsScheduledForAddition.forEach(system => { this._actuallyAddSystem(system); });
    this.systemsScheduledForAddition = [];

    entity_db.cleanup();
  }

  getSystemByType(systemType) {
    for (let i = 0; i < this.systems.length; ++i) {
      if (this.systems[i].constructor == systemType) return this.systems[i];
    }
    return null;
  }

  run(width, height, { fullScreen = false, showEngineStats = false }) {
    this.running = true;
    this.init(width, height);
    if (fullScreen) {
      GameEngine.fullScreen();
    }
    let mainLoop = () => {
      let now = GameEngine._timestamp();
      let deltaTime = now - this.#now;
      this.#now = now;

      this.systems.forEach(system => system.update(deltaTime));

      event_manager.update();

      this.postUpdate();

      if (showEngineStats) {
        this.debugFPS.log(Math.round(1 / deltaTime) + ' FPS');
        this.debugNumEntities.log(entity_db.entities.length + ' total entities');
        this.debugNumSystems.log(this.systems.length + ' total systems');
        // this.debugMousePos.log('Mouse at: ' + mouse.pos.x + ', ' + mouse.pos.y);
      }

      requestAnimationFrame(mainLoop);
    };
    mainLoop();
  }
}

export let game_engine = new GameEngine();
