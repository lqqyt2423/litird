'use strict';

const app = require('litird').app;

const { Entity } = app;
const user = new Entity({
  id: String,
  name: String,
  age: Number,
  gender: Number,
});

module.exports = user;
