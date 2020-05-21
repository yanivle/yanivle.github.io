import { removeByValueInplace } from "../core/util.mjs";

export class EntityDatabase {
  constructor() {
    this.reset();
  }

  reset() {
    this.entities = [];
    window.entities = this.entities;
    this.indices = {};
    this.scheduledForRemoval = new Set();
    this.scheduledComponentAdditions = [];
    this.scheduledComponentRemovals = [];
  }

  add(entity) {
    this.entities.push(entity);
    for (let index of Object.values(this.indices)) {
      if (index.key.matches(entity)) {
        index.add(entity);
      }
    }
  }

  remove(entity) {
    removeByValueInplace(this.entities, entity);
    for (let index of Object.values(this.indices)) {
      if (index.key.matches(entity)) {
        index.remove(entity);
      }
    }
  }

  scheduleRemoval(entity) {
    this.scheduledForRemoval.add(entity);
  }

  scheduleComponentAddition(entity, componentType) {
    this.scheduledComponentAdditions.push([entity, componentType]);
  }

  scheduleComponentRemoval(entity, componentType) {
    this.scheduledComponentRemovals.push([entity, componentType]);
  }

  cleanup() {
    for (let [entity, componentType] of this.scheduledComponentAdditions) {
      entity.addComponent(componentType);
    }
    this.scheduledComponentAdditions = [];

    for (let [entity, componentType] of this.scheduledComponentRemovals) {
      entity.removeComponent(componentType);
    }
    this.scheduledComponentRemovals = [];

    for (let entity of this.scheduledForRemoval) {
      this.remove(entity);
    }
    this.scheduledForRemoval.clear();
  }

  index(...componentTypes) {
    let key = new Key(...componentTypes);
    if (!(key in this.indices)) {
      let index = new Index(key);
      this.indices[key] = index;
      this.entities.forEach(entity => {
        if (key.matches(entity)) {
          index.add(entity);
        }
      });
    }
    return this.indices[key];
  }

  updatedIndicesAddedComponentType(entity, componentType) {
    for (let index of Object.values(this.indices)) {
      if (index.key.containsComponentType(componentType)) {
        if (index.key.matches(entity)) {
          index.add(entity);
        }
      }
    };
  }

  updatedIndicesRemovingComponentType(entity, componentType) {
    for (let index of Object.values(this.indices)) {
      if (index.key.containsComponentType(componentType)) {
        if (index.key.matches(entity)) {
          index.remove(entity);
        }
      }
    };
  }
}

export let entity_db = new EntityDatabase();

export class Key {
  constructor(...componentTypes) {
    this.componentTypes = [...componentTypes].sort();
  }

  toString() {
    return 'Key(' + this.componentTypes.toString() + ')';
  }

  containsComponentType(componentType) {
    return this.componentTypes.includes(componentType);
  }

  matches(entity) {
    const entityComponentTypes = entity.getComponentTypes();
    for (const componentType of this.componentTypes) {
      if (!entityComponentTypes.includes(componentType.toString())) return false;
    }
    return true;
  }
}

class Index {
  #entities = [];
  #iterationDepth = 0;

  constructor(key) {
    this.key = key;
  }

  add(entity) {
    if (this.#iterationDepth != 0) console.error('Cannot modify index during iteration. Use copyEntities.forEach(...) instead.', this.#iterationDepth);
    this.#entities.push(entity);
  }

  remove(entity) {
    if (this.#iterationDepth != 0) console.error('Cannot modify index during iteration. Use copyEntities.forEach(...) instead.', this.#iterationDepth);
    removeByValueInplace(this.#entities, entity);
  }

  get length() {
    return this.#entities.length;
  }

  at(i) {
    return this.#entities[i];
  }

  // return the raw entities vector - you must never change it's value while iterating on it.
  entitiesUnsafe() {
    return this.#entities;
  }

  copyEntities() {
    return [...this.#entities];
  }

  forEach(cb) {
    this.#iterationDepth++;
    this.#entities.forEach(entity => {
      cb(entity);
    });
    this.#iterationDepth--;
  }
}

export class Debugger {
  static entitiesWithNameMatchingRegexp(regexp_pattern) {
    let regexp = new RegExp(regexp_pattern);
    let res = [];
    entity_db.entities.forEach(entity => {
      if (regexp.test(entity.name)) {
        res.push(entity);
      }
    });
    return res;
  }

  static entitiesWithComponentNames(...componentNames) {
    let res = [];
    entity_db.entities.forEach(entity => {
      let entityComponentNames = Object.values(entity.components).map(component => component.constructor.name);
      let match = true;
      for (let componentName of componentNames) {
        if (!entityComponentNames.includes(componentName)) {
          match = false;
          break;
        }
      }
      if (match) {
        res.push(entity);
      }
    });
    return res;
  }


  static entitiesWithComponents(...components) {
    let key = Key(...components);
    let res = [];
    entity_db.entities.forEach(entity => {
      if (key.matches(entity)) {
        res.push(entity);
      }
    });
    return res;
  }
}

window.ecs_debugger = Debugger;
