'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/users/:id', controller.user.show);
};
