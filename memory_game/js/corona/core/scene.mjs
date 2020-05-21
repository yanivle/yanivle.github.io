export class Scene {
  constructor() {
    this.entities = [];
  }

  // Add entities and systems
  init() { }

  addEntity(entity) {
    this.entities.push(entity);
  }

  // Remove entities and systems
  teardown() {
    this.entities.forEach(entity => { entity.destroy(); });
  }
}
