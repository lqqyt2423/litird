'use strict';

const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const getPath = (...p) => path.join(cwd, ...p);
const lowerFirstLetter = str => str.charAt(0).toLowerCase() + str.slice(1);
const upperFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

function load(logger, dirname, callback, isFunc = true) {
  const files = fs.readdirSync(getPath(dirname));
  for (const file of files) {
    if (!/\.js$/.test(file)) continue;

    const name = file.replace(/\.js$/, '');
    const func = require(getPath(dirname, file));
    if (isFunc && typeof func !== 'function') {
      logger.warn('load %s %s failed', dirname, name);
      continue;
    }

    const lname = lowerFirstLetter(name);
    const uname = upperFirstLetter(name);
    callback(null, {
      name,
      lname,
      uname,
      func,
    });
    logger.info('load %s %s', dirname, name);
  }
}

module.exports = { load, getPath };
