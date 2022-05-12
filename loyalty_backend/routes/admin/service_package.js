/* eslint-disable prettier/prettier */
const express = require('express');

const UserCtrl = require('../../controllers/admin/user');
const NormalUserCtrl = require('../../controllers/user');
const ServicePackageCtrl = require('../../controllers/admin/service_package');
const { catchError } = require('../../controllers/error');

const router = express.Router();

/**
 * create service package
 */
router.post('/', UserCtrl.checkAuth, catchError(ServicePackageCtrl.create));

/**
 * load service packages by query
 */
router.post('/load', NormalUserCtrl.checkAuth, catchError(ServicePackageCtrl.loadByQuery));

/**
 * get service package
 */
router.get('/:id', UserCtrl.checkAuth, catchError(ServicePackageCtrl.get));

/**
 * edit service package
 */
router.put('/:id', UserCtrl.checkAuth, catchError(ServicePackageCtrl.update));

/**
 * remove service package
 */
router.delete('/:id', UserCtrl.checkAuth, catchError(ServicePackageCtrl.remove));


module.exports = router;
