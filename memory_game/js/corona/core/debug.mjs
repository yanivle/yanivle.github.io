import { context } from "./canvas.mjs";

let debugLines = 0;

export class Debug {
  constructor(logToConsoleToo = false) {
    debugLines++;
    this.y = 20 * debugLines;
    this.logToConsoleToo = logToConsoleToo;
  }

  log(message) {
    context.font = "20px Georgia";
    var textMetrics = context.measureText(message);
    context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    context.fillRect(10, this.y - 20, textMetrics.width, 20);
    context.fillStyle = 'black';
    context.fillText(message, 10, this.y);
    if (this.logToConsoleToo) {
      console.log(message);
    }
  }

  static debugInConsole(name, variable) {
    window[name] = variable;
  }
}
