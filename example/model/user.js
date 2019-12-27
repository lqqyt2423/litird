'use strict';

module.exports = app => function User() {
  const { mongoose, mongoosePlugins } = app;
  const { Schema } = mongoose;

  const UserSchema = new Schema({
    name: String,
    age: Number,
    gender: Number,
  });

  UserSchema.plugin(mongoosePlugins.motime);
  UserSchema.plugin(mongoosePlugins.paginate);

  return mongoose.model('User', UserSchema);
};
