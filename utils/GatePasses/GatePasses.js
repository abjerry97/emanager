const crypto = require("crypto");
const generateCode = () => {
    const array = [];
    for (let index = 0; index < 6; index++) {
      array[index] = crypto.randomInt(9);
    }
    return array.join("");
  };
  
  function handlePass(fn, date) {
    return setTimeout(fn, Date.now() - date);
  }

  module.exports = {
    generateCode,
    handlePass

  }