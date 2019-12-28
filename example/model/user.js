'use strict';

const app = require('litird').app;

const { mongoose, mongoosePlugins } = app;
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  age: Number,
  gender: Number,
});

UserSchema.plugin(mongoosePlugins.motime);
UserSchema.plugin(mongoosePlugins.paginate);

module.exports = mongoose.model('User', UserSchema);
