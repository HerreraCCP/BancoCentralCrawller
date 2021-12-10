const { colours } = require('../json/index');
const fs = require('fs');
const path = require('path');
const https = require('https');

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
