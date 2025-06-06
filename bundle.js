(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const range_slider_integer = require("..");
const opts = { min: 0, max: 10 };
const rsi = range_slider_integer(opts);

document.body.append(rsi);

},{"..":4}],2:[function(require,module,exports){
module.exports = inputInteger;

//CSS Styling
const sheet = new CSSStyleSheet();
const theme = get_theme();
sheet.replaceSync(theme);

// main function
function inputInteger(opts) {
  const { min, max, id = 0 } = opts;
  const name = `input-integer-${id}`;

  const notify = protocol({ from: name }, listen);

  function listen(message) {
    const { type, data } = message;
    if (type === "update") {
      input.value = data;
    }
  }

  const el = document.createElement("div");
  const shadow = el.attachShadow({ mode: "closed" });
  const input = document.createElement("input");

  input.type = "number";
  input.min = min;
  input.max = max;
  input.onkeyup = (e) => handle_onkeyup(e, input, min, max);
  input.onmouseleave = (e) => handle_onmouseleave_and_blur(e, input, min);
  input.onblur = (e) => handle_onmouseleave_and_blur(e, input, min);

  shadow.append(input);

  shadow.adoptedStyleSheets = [sheet];

  return el;
}

function get_theme() {
  return `
    input {
      padding: 10px 16px;
      background-color: hsla(284, 45%, 54%, 1);
      border: none;
      border-radius: 25px;
      color: #ffffff;
      font-size: 15px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      outline: none;
      width: 100%;
      max-width: 300px;
      transition: 
        background-color 0.3s ease,
        box-shadow 0.3s ease,
        transform 0.2s ease;
    }

    input::placeholder {
      color: #f0e6f6;
      opacity: 0.9;
    }

    input:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    input:focus {
      background-color: #d843d0;
      box-shadow: 0 0 0 3px rgba(216, 67, 208, 0.3);
    }
  `;
}

function handle_onkeyup(e, input, min, max) {
  const val = Number(e.target.value);
  const val_len = val.toString().length;
  const min_len = min.toString().length;

  if (max < val) {
    input.value = max;
  } else if (val_len === min_len && min > val) {
    input.value = min;
  }

  notify({ from: name, type: "update", data: val });
}

function handle_onmouseleave_and_blur(e, input, min) {
  const val = Number(e.target.value);

  if (min > val) {
    input.value = "";
  }
}

},{}],3:[function(require,module,exports){
module.exports = rangeSlider;

var id = 0;

function rangeSlider(opts, protocol) {
  const { min = 0, max = 500, id = 0 } = opts;
  const name = `range-${id}`;

  const el = document.createElement("div");
  el.classList.add("container");
  const shadow = el.attachShadow({ mode: "closed" });

  const notify = protocol({ from: name }, listen);

  function listen(message) {
    const { type, data } = message;
    if (type === "update") {
      input.value = data;
      fill.style.width = `${(data / max) * 100}%`;
      input.focus();
    }
  }

  const input = document.createElement("input");
  input.type = "range";
  input.min = min;
  input.max = max;
  input.value = min;

  input.oninput = handle_input;

  const bar = document.createElement("div");
  bar.classList.add("bar");

  const ruler = document.createElement("div");
  ruler.classList.add("ruler");

  const fill = document.createElement("div");
  fill.classList.add("fill");

  bar.append(ruler, fill);

  const style = document.createElement("style");
  style.textContent = get_theme();

  shadow.append(style, input, bar);
  return el;

  function get_theme() {
    return `
  :host { box-sizing: border-box; }
  *, *:before, *:after { box-sizing: inherit; }
  :host {
    --white       : hsla(0,0%,100%,1);
    --transparent : hsla(0,0%,0%,0);
    --grey        : hsla(0,0%,90%,1);
    --blue       : hsla(207, 88%, 66%, 1);
    position: relative;
    width: 100%;
    height: 16px;
  }
  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    -webkit-appearance: none;
    outline: none;
    margin: 0;
    z-index: 2;
    background-color: var(--transparent);
  }
  .bar {
    position: absolute;
    top: 3px;
    left: 0;
    z-index: 0;
    height: 10px;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--grey);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .ruler {
    position: absolute;
    height: 6px;
    width: 100%;
    transform: scale(-1, 1);
    background-size: 20px 8px;
    background-image:  repeating-linear-gradient(to right,
      var(--grey) 0px,
      var(--grey) 17px,
      var(--white) 17px,
      var(--white) 20px
    );
  }
  .fill {
    position: absolute;
    height: 100%;
    width: 0%;
    background-color: var(--grey);
  }
  input:focus + .bar .fill,
  input:focus-within + .bar .fill,
  input:active + .bar .fill {
    background-color: var(--blue);
  }
  input::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--white);
    border: 1px solid var(--grey);
    cursor: pointer;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .4);
    transition: background-color .3s, box-shadow .15s linear;
  }
  input::-webkit-slider-thumb:hover {
    box-shadow: 0 0 0 14px rgba(94, 176, 245, .8);
  }
  input::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--white);
    border: 1px solid var(--grey);
    cursor: pointer;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .4);
    transition: background-color .3s, box-shadow .15s linear;
  }
  input::-moz-range-thumb:hover {
    box-shadow: 0 0 0 14px rgba(94, 176, 245, .8);
  }
  `;
  }

  function handle_input(e) {
    const val = Number(e.target.value);
    fill.style.width = `${(val / max) * 100}%`;
    notify({ from: name, type: "update", data: val });
  }
}

},{}],4:[function(require,module,exports){
const range = require("range-slider-apen");
const integer = require("input-integer-apen");

module.exports = range_slider_integer;

function range_slider_integer(opts) {
  const { id = 0 } = opts; 
  const state = {};
  const el = document.createElement("div");
  const shadow = el.attachShadow({ mode: "closed" });

  const rsi = document.createElement("div");
  rsi.classList.add("rsi");

  // Unique names for each component
  const rangeName = `range-${id}`;
  const inputName = `input-integer-${id}`;

  const range_slider = range({ ...opts, id }, protocol);
  const input_integer = integer({ ...opts, id }, protocol);
  rsi.append(range_slider, input_integer);

  const style = document.createElement("style");
  style.textContent = get_theme();

  shadow.append(rsi, style);

  return el;

  function protocol(message, notify) {
    const { from } = message;
    state[from] = { value: 0, notify };
    return listen;
  }

  function listen(message) {
    const { from, type, data } = message;
    state[from].value = data;

    if (type === "update") {
      let notify;
      if (from === rangeName) notify = state[inputName]?.notify;
      else if (from === inputName) notify = state[rangeName]?.notify;
      notify?.({ type, data });
    }
  }

  function get_theme() {
    return `
    .rsi {
      padding: 1.5rem;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1.5rem;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(135deg, #ffffff, #f0f4ff);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      border: 1px solid #e0e7ff;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .rsi:hover {
      transform: scale(1.01);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
  `;
  }
}

},{"input-integer-apen":2,"range-slider-apen":3}]},{},[1]);
