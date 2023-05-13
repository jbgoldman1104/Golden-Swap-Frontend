//const numFormatter = require('./util');


function numFormatter(num) {
  if (num > 999 && num < 1000000) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");// convert to K for number from > 1000 < 1 million
  } else if (num > 1000000 && num < 1000000000) {
    return (num / 1000000).toFixed(2) + "M"; // convert to M for number from > 1 million
  } else if (num > 1000000000 && num < 1000000000000 ) {
    return (num / 1000000000).toFixed(2) + "B";
  } else if (num > 1000000000000) {
    return (num / 1000000000000).toFixed(2) + "T";
  } else if (num < 900) {
    return num; // if value < 1000, nothing to do
  }
}


console.log(numFormatter(90000000000));