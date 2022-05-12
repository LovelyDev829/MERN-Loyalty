/* eslint-disable prettier/prettier */
const express = require('express');

const UserCtrl = require('../../controllers/admin/user');
const NormalUserCtrl = require('../../controllers/user');
const VendorCtrl = require('../../controllers/admin/vendor');
const { catchError } = require('../../controllers/error');

const router = express.Router();

/**
 * create vendor
 */
router.post('/', UserCtrl.checkAuth, catchError(VendorCtrl.create));

/**
 * load vendors by query
 */
router.post('/load', NormalUserCtrl.checkAuth, catchError(VendorCtrl.loadByQuery));

/**
 * get vendor
 */
router.get('/:id', UserCtrl.checkAuth, catchError(VendorCtrl.get));

/**
 * edit vendor
 */
router.put('/:id', UserCtrl.checkAuth, catchError(VendorCtrl.update));

/**
 * remove vendor
 */
router.delete('/:id', UserCtrl.checkAuth, catchError(VendorCtrl.remove));


module.exports = router;
