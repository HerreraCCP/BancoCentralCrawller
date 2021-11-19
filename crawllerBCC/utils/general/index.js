const { colours } = require('../json/index');

module.exports.htmlToJson = (div, obj) => {
  if (!obj) obj = [];
  var tag = {};

  tag['tagName'] = div.tagName;
  tag['children'] = [];

  for (var i = 0; i < div.children.length; i++) {
    tag['children'].push(htmlToJson(div.children[i]));
  }

  for (var i = 0; i < div.attributes.length; i++) {
    var attr = div.attributes[i];
    tag['@' + attr.name] = attr.value;
  }

  return tag;
};

module.exports.removeDuplicates = async function (data) {
  return Array.from(
    data.filter((value, index) => data.indexOf(value) === index)
  );
};

module.exports.quantityOfTags = async function (pag) {
  const regex = /\<([^\>]+)\>/g;
  let tes = await pag.evaluate((el) => el.innerHTML);

  let i = 0;
  do {
    i++;
  } while (regex.test(tes));
  return i;
};

module.exports.autoScroll = async function (page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
};

module.exports.logWarn = (res) => {
  console.log(colours.fg.yellow, JSON.stringify(res, ' ', 4), colours.reset);
};

module.exports.logInfo = (res) => {
  console.log(colours.fg.cyan, JSON.stringify(res, ' ', 4), colours.reset);
};

module.exports.logRed = (res) => {
  console.log(colours.fg.red, JSON.stringify(res, ' ', 4), colours.reset);
};
