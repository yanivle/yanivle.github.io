import { Position } from "../components/base_components.mjs";

export function anchor(followingEntity, anchorEntity) {
  followingEntity.addComponent(anchorEntity.getComponent(Position));
}
