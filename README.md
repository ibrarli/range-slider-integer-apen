# range-slider-integer-apen

const range_slider_integer = require("..");
const opts = { min: 0, max: 10 };
const rsi = range_slider_integer(opts);

document.body.append(rsi);
