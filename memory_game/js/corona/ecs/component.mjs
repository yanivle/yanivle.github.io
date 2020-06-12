export class Component {
}

// TODO: make all instances of TagComponent children the same object instead of allocating new ones.
export class TagComponent {
  clone() {
    return this;
  }
}
