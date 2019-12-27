#!/usr/bin/env node

'use strict';

const path = require('path');
const ncp = require('ncp').ncp;

const source = path.join(__dirname, '../example');
const target = process.cwd();

ncp(source, target, err => {
  if (err) {
    console.error(err);
    return;
  }
  console.info('done. then please run "npm i" and "npm start".');
});
