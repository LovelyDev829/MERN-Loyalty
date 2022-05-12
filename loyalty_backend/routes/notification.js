const express = require('express');

const NotificationCtrl = require('../controllers/notification');

const UserCtrl = require('../controllers/user');
const { catchError } = require('../controllers/error');

const router = express.Router();
/**
 * create notification
 */
router.post('/', UserCtrl.checkAuth, catchError(NotificationCtrl.create));

/**
 * get notification list
 */
router.get('/', UserCtrl.checkAuth, catchError(NotificationCtrl.getAll));

/**
 * load notifications by query
 */
router.post(
  '/load',
  UserCtrl.checkAuth,
  catchError(NotificationCtrl.loadByQuery)
);

/**
 * get notification
 */
router.get('/:id', UserCtrl.checkAuth, catchError(NotificationCtrl.get));

/**
 * get notification and related data, for ex: customer
 */
router.get(
  '/related/:id',
  UserCtrl.checkAuth,
  catchError(NotificationCtrl.getAlsoRelated)
);

/**
 * edit notification
 */
router.put(
  '/mark-all-as-read',
  UserCtrl.checkAuth,
  catchError(NotificationCtrl.markAllAsRead)
);

/**
 * edit notification
 */
router.put('/:id', UserCtrl.checkAuth, catchError(NotificationCtrl.update));

/**
 * remove notification
 */
router.delete('/:id', UserCtrl.checkAuth, catchError(NotificationCtrl.remove));

/**
 * create bulk notification
 */
router.post(
  '/create-bulk',
  UserCtrl.checkAuth,
  catchError(NotificationCtrl.createBulk)
);

/**
 * create bulk notification
 */
router.post(
  '/load-transaction',
  UserCtrl.checkAuth,
  catchError(NotificationCtrl.loadByQueryTransaction)
);

module.exports = router;
