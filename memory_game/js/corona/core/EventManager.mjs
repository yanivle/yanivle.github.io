import { removeByValueInplace } from "./util.mjs";

class EventQueue {
  constructor() {
    this._events = [];
    this._callbacks = [];
    this._scheduledUnsubscribes = [];
  }

  clear() {
    this._events = [];
  }

  get events() {
    return this._events;
  }

  subscribe(callback) {
    this._callbacks.push(callback);
  }

  unsubscribe(callback) {
    removeByValueInplace(this._callbacks, callback);
  }

  scheduleUnsubscribe(callback) {
    this._scheduledUnsubscribes.push(callback);
  }

  unsubscribeScheduled() {
    if (!this._scheduledUnsubscribes) return;
    this._scheduledUnsubscribes.forEach(callback => {
      this.unsubscribe(callback);
    });
    this._scheduledUnsubscribes = [];
  }

  publish(event) {
    // console.log(event);
    this._events.push(event);
  }
}

class EventManager {
  constructor() {
    this.eventQueues = {};
  }

  getEventQueue(eventQueueName) {
    if (!(eventQueueName in this.eventQueues)) {
      this.eventQueues[eventQueueName] = new EventQueue();
    }
    return this.eventQueues[eventQueueName];
  }

  update() {
    Object.values(this.eventQueues).forEach(queue => {
      queue._callbacks.forEach(callback => {
        queue._events.forEach(event => {
          callback(event);
        });
      });
      queue.clear();
      queue.unsubscribeScheduled();
    });
  }
}

export let event_manager = new EventManager();
