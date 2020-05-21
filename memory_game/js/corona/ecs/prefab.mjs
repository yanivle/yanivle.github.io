import { Entity } from "./entity.mjs";

export class Prefab {
  constructor(templateEntity) {
    Prefab.validateTemplateEntity(templateEntity);
    this.templateEntity = templateEntity;
  }

  static validateTemplateEntity(templateEntity) {
    console.assert(!templateEntity.index, 'Prefab template entities must not be indexed (pass false for the index arg when creating the entity)');
    Object.values(templateEntity.components).forEach(templateComponent => {
      console.assert(typeof templateComponent.clone === 'function', 'All components used as prefab templates must have a clone method', templateComponent);
    });
  }

  // TODO: This assumes only primitive types (arrays etc will be copied by reference and not cloned!).
  instantiate(name = null) {
    let res = new Entity(name);
    return this.updateEntity(res);
  }

  updateEntity(entity) {
    Object.values(this.templateEntity.components).forEach(templateComponent => {
      entity.addComponent(templateComponent.clone());
    });
    return entity;
  }
}

// export class PrefabManager {
//   constructor() {
//     this.prefabs = {};
//   }

//   addPrefab(name, templateEntity) {
//     this.prefabs[name] = new Prefab(templateEntity);
//   }

//   getPrefab(name) {
//     return this.prefabs[name];
//   }
// }

