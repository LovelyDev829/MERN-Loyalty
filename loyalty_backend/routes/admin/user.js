const express = require('express');

const UserCtrl = require('../../controllers/admin/user');
const { catchError } = require('../../controllers/error');

const router = express.Router();

/**
 * create user
 */
router.post('/', UserCtrl.checkAuth, catchError(UserCtrl.create));

/**
 * load users by query
 */
router.post('/load', UserCtrl.checkAuth, catchError(UserCtrl.loadByQuery));

/**
 * get user
 */
router.get('/:id', UserCtrl.checkAuth, catchError(UserCtrl.get));

/**
 * edit user
 */
router.put('/:id', UserCtrl.checkAuth, catchError(UserCtrl.update));

/**
 * remove user
 */
router.delete('/:id', UserCtrl.checkAuth, catchError(UserCtrl.remove));

/**
 * enable / disable user login
 */
router.post(
  '/set-active/:id',
  UserCtrl.checkAuth,
  catchError(UserCtrl.setActive)
);

/**
 * reset user password
 */
router.post(
  '/reset-password/:id',
  UserCtrl.checkAuth,
  catchError(UserCtrl.resetPassword)
);

/**
 * get user verifiedEmail
 */
router.post(
  '/get-verified-email/:email',
  catchError(UserCtrl.getVerifiedEmail)
);

/**
 * enable / disable admin rights
 */
router.post(
  '/set-admin/:id',
  UserCtrl.checkAuth,
  catchError(UserCtrl.setAdmin)
);

/**
 * enable / disable Reports Access
 */
router.post(
  '/set-reports-access/:id',
  UserCtrl.checkAuth,
  catchError(UserCtrl.setReportsAccess)
);
module.exports = router;
