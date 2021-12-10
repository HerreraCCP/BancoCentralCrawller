const { colours } = require('../json/index');

module.exports.logWarn = (res) => {
  console.log(colours.fg.yellow, JSON.stringify(res, ' ', 4), colours.reset);
};

module.exports.logInfo = (res) => {
  console.log(colours.fg.cyan, JSON.stringify(res, ' ', 4), colours.reset);
};

module.exports.logRed = (res) => {
  console.log(colours.fg.red, JSON.stringify(res, ' ', 4), colours.reset);
};
