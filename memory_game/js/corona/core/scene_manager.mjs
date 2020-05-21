export class SceneManager {
  constructor() {
    this.scenes = {};
    this.currentScene = null;
    this.currentSceneName = null;
    this.running = false;
  }

  init() {
    this.running = true;
    if (this.currentScene) {
      console.log('Initializing scene:', this.currentSceneName);
      this.currentScene.init();
    }
  }

  addScene(sceneName, scene) {
    console.log('Adding scene:', sceneName);
    this.scenes[sceneName] = scene;
  }

  startScene(sceneName) {
    console.log('Starting scene', sceneName);
    console.assert(sceneName in this.scenes, sceneName, this.scenes);
    let scene = this.scenes[sceneName];
    console.assert(scene, 'Invalid scene for name:', sceneName);
    if (scene == this.currentScene) {
      console.warn('Scene', sceneName, 'already started.')
      return;
    }
    if (this.currentScene != null) {
      console.log('Tearing down scene:', this.currentSceneName);
      this.currentScene.teardown();
    }
    this.currentScene = scene;
    this.currentSceneName = sceneName;
    if (this.running) {
      console.log('Initializing scene:', this.currentSceneName);
      scene.init();
    }
  }
}
