const express = require('express');

const DriverCtrl = require('../../controllers/admin/driver');

const UserCtrl = require('../../controllers/admin/user');
const NormalUserCtrl = require('../../controllers/user');
const { catchError } = require('../../controllers/error');

const router = express.Router();
/**
 * create driver
 */
router.post('/', UserCtrl.checkAuth, catchError(DriverCtrl.create));

/**
 * load drivers by query
 */
router.post(
  '/load',
  NormalUserCtrl.checkAuth,
  catchError(DriverCtrl.loadByQuery)
);

/**
 * get driver
 */
router.get('/:id', UserCtrl.checkAuth, catchError(DriverCtrl.get));

/**
 * edit driver
 */
router.put('/:id', UserCtrl.checkAuth, catchError(DriverCtrl.update));

/**
 * remove driver
 */
router.delete('/:id', UserCtrl.checkAuth, catchError(DriverCtrl.remove));

/**
 * set / unset default driver
 */
router.post(
  '/set-default/:id',
  UserCtrl.checkAuth,
  catchError(DriverCtrl.setDefault)
);

module.exports = router;
