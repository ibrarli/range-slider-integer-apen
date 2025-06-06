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
