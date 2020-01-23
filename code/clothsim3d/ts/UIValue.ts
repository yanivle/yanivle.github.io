import {generateGUID} from './rand.js'

let hide_ui = true;

let getters = new Map();

class Getter {
  name: string;
  initial_value: number;
  min: number;
  max: number;
  step: number;
  slider: HTMLInputElement;
  detected_inconsistency: boolean;

  constructor(name:string, initial_value:number, min:number, max:number,
              step:number=1) {
    this.name = name;
    this.initial_value = initial_value;
    this.min = min;
    this.max = max;
    this.step = step;
    this.detected_inconsistency = false;
    this.createSlider();
  }

  createSlider():void {
    let slider = document.createElement('input');
    slider.id = slider.name = this.name;
    slider.value = <string> <any> (this.initial_value / this.step);
    slider.min = <string> <any> (this.min / this.step);
    slider.max = <string> <any> (this.max / this.step);
    // slider.step = <string> <any> this.step;
    slider.type = "range";
    // let guid = generateGUID();
    // slider.setAttribute('list', guid);
    // let tickmarks = document.createElement('datalist');
    // tickmarks.id = guid;
    // let option_min = document.createElement('option');
    // option_min.value = slider.min;
    // option_min.label = slider.min;
    // tickmarks.appendChild(option_min);
    // let option_max = document.createElement('option');
    // option_max.value = slider.max;
    // option_max.label = slider.max;
    // tickmarks.appendChild(option_max);
    // document.getElementById('insert_point').appendChild(tickmarks);
    this.slider = slider;
    let p = document.createElement('p');
    let text = document.createTextNode(this.name + ":");
    // let min_text = document.createElement('small');
    // min_text.innerText = <string> <any> this.min;
    // let max_text = document.createElement('small');
    // max_text.innerText = <string> <any> this.max;
    let value_span = document.createElement('span');
    value_span.innerText = <string> <any> this.value;
    p.appendChild(text);
    // p.appendChild(min_text);
    p.appendChild(slider);
    // p.appendChild(max_text);
    p.appendChild(value_span);
    let getter = this;
    slider.oninput = function() {
      value_span.innerText = <string> <any> getter.value;
    }
    document.getElementById('insert_point').appendChild(p);
  }

  get value():number {
    return (<number> <any> this.slider.value) * this.step;
  }

  validate(name, initial_value, min, max, step):boolean {
    if (this.detected_inconsistency) {
      return;
    }
    if (this.name != name) {
      this.detected_inconsistency = true;
      console.error('Inconsistent name', this.name, name);
      return false;
    }
    if (this.initial_value != initial_value) {
      this.detected_inconsistency = true;
      console.error('Inconsistent initial_value', this.name,
                    this.initial_value, initial_value);
      return false;
    }
    if (this.min != min) {
      this.detected_inconsistency = true;
      console.error('Inconsistent min', this.name, this.min, min);
      return false;
    }
    if (this.max != max) {
      this.detected_inconsistency = true;
      console.error('Inconsistent max', this.name, this.max, max);
      return false;
    }
    if (this.step != step) {
      this.detected_inconsistency = true;
      console.error('Inconsistent step', this.name, this.step, step);
      return false;
    }
    return true;
  }
}

export default function UIValue(name, value, min, max, step):number {
  if (hide_ui) {
    return value;
  }
  if (!getters.has(name)) {
    let getter = new Getter(name, value, min, max, step);
    getters.set(name, getter);
  }
  let getter = getters.get(name);
  if (!getter.validate(name, value, min, max, step)) {
    return null;
  }
  return getter.value;
}
