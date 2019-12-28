'use strict';

const app = require('litird').app;

const { router, controller } = app;

router.get('/', controller.home.index);
router.get('/users/:id', controller.user.show);
