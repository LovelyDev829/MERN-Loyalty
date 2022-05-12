const express = require('express');

const settingForNotificationCtrl = require('../controllers/garbage');

const UserCtrl = require('../controllers/user');
const { catchError } = require('../controllers/error');

const router = express.Router();
/**
 * create notification
 */
router.post(
  '/',
  UserCtrl.checkAuth,
  catchError(settingForNotificationCtrl.create)
);

/**
 * load notifications by query
 */
router.post(
  '/load',
  UserCtrl.checkAuth,
  catchError(settingForNotificationCtrl.loadByQuery)
);

/**
 * get notification
 */
router.get('/', UserCtrl.checkAuth, catchError(settingForNotificationCtrl.get));

/**
 * get notification and related data, for ex: customer
 */
router.get(
  '/related/:id',
  UserCtrl.checkAuth,
  catchError(settingForNotificationCtrl.getAlsoRelated)
);

/**
 * edit notification
 */
//  router.put('/:id', UserCtrl.checkAuth, catchError(settingForNotificationCtrl.update));
router.put(
  '/',
  UserCtrl.checkAuth,
  catchError(settingForNotificationCtrl.update)
);

/**
 * remove notification
 */
router.delete(
  '/:id',
  UserCtrl.checkAuth,
  catchError(settingForNotificationCtrl.remove)
);

/**
 * create bulk notification
 */
router.post(
  '/create-bulk',
  UserCtrl.checkAuth,
  catchError(settingForNotificationCtrl.createBulk)
);

/**
 * create bulk notification
 */
router.post(
  '/load-transaction',
  UserCtrl.checkAuth,
  catchError(settingForNotificationCtrl.loadByQueryTransaction)
);

module.exports = router;
