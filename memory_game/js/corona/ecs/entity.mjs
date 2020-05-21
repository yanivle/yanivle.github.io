import { entity_db } from "./entity_database.mjs";

export class Entity {
  constructor(name = null, index = true) {
    this.name = name;
    this.components = {};
    this.index = index;
    if (index) entity_db.add(this);
  }

  toString() {
    return 'Entity(' + JSON.stringify(Object.values(this.components)) + ')';
  }

  destroy() {
    entity_db.remove(this);
  }

  scheduleDestruction() {
    entity_db.scheduleRemoval(this);
  }

  scheduleAddComponent(component) {
    entity_db.scheduleComponentAddition(this, component);
  }

  scheduleRemoveComponent(component) {
    entity_db.scheduleComponentRemoval(this, component);
  }

  addComponent(component) {
    let componentType = component.constructor;
    let reallyAdd = !(componentType in this.components);
    this.components[componentType] = component;
    if (reallyAdd && this.index) {
      // This needs to be called after adding the component.
      entity_db.updatedIndicesAddedComponentType(this, componentType);
    }
    return this;
  }

  removeComponent(componentType) {
    if (!(componentType in this.components)) return this;
    if (this.index) {
      // This needs to be called before the delete.
      entity_db.updatedIndicesRemovingComponentType(this, componentType);
    }
    delete this.components[componentType];
    return this;
  }

  getComponent(componentType) {
    return this.components[componentType];
  }

  getComponentTypes() {
    return Object.keys(this.components);
  }
}
