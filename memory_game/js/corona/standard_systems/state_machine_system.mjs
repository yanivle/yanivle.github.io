import { game_engine, mouse } from "../core/game_engine.mjs";

export class State {
  constructor(id, cb, next, nextOnPress, nextTimeout) {
    this.id = id;
    this.cb = cb;
    this.next = next;
    this.nextOnPress = nextOnPress;
    this.nextTimeout = nextTimeout;
    this.executed = false;
  }

  execute() {
    this.executed = true;
    this.cb();
  }

  executeOnce() {
    if (!this.executed) this.execute();
  }
}

export class StateMachineSystem {
  constructor() {
    this.states = {};
    this.stateId = 0;
    console.log('solve all these shenanigans with timing...');
    this.startTime = 0;
  }

  addState(state) {
    this.states[state.id] = state;
  }

  update() {
    let state = this.states[this.stateId];
    state.executeOnce();
    let timeElapsed = game_engine.now - this.startTime;
    if ((mouse.pressed && state.nextOnPress) || timeElapsed > state.nextTimeout) {
      this.stateId = state.next;
    }
  }
}
