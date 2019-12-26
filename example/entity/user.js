'use strict';

module.exports = app => function user() {
  const { Entity } = app;
  const user = new Entity({
    id: String,
    name: String,
    age: Number,
    gender: Number,
  });
  return user;
};
