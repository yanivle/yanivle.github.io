import { removeByValueInplace } from './util.mjs';

class Sequencer {
  constructor() {
    this._followList = {};
    this._events = {};
  }

  setCallback(eventName, callback) {
    this._events[eventName] = callback;
  }

  follow(triggeringEventName, triggeredEventName) {
    if (!(triggeringEventName in this._followList)) {
      this._followList[triggeringEventName] = [];
    }
    this._followList[triggeringEventName].push(triggeredEventName);
  }

  unfollow(triggeringEventName, triggeredEventName) {
    console.assert(triggeringEventName in this._followList);
    removeByValueInplace(this._followList[triggeringEventName], triggeredEventName);
  }

  // addAlias(eventName, alias) {
  //   this.follow(eventName, alias);
  //   console.assert(eventName in this._events, 'Adding alias to non-existing event', eventName);
  //   this.setCallback(alias, this._events[eventName]);
  // }

  notifyEnded(eventName) {
    if (eventName in this._followList) {
      this._followList[eventName].forEach(triggeredEventName => {
        console.log('Sequencer:', eventName, 'triggered', triggeredEventName);
        if (!(triggeredEventName in this._events)) {
          console.error('Sequencer:', eventName, 'trying to trigger non-existing event', triggeredEventName);
        }
        this._events[triggeredEventName]();
      });
    }
  }
}

export let sequencer = new Sequencer();
