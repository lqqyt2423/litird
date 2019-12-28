'use strict';

/**
 * @param {Litird} app - litird application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.get('/users/:id', controller.user.show);
};
