/* eslint-disable prettier/prettier */
const express = require('express');

const UserCtrl = require('../../controllers/admin/user');
const NormalUserCtrl = require('../../controllers/user');
const CustomerRepresentativeCtrl = require('../../controllers/admin/customer_representative');
const { catchError } = require('../../controllers/error');

const router = express.Router();

/**
 * create customerRepresentative
 */
router.post('/', UserCtrl.checkAuth, catchError(CustomerRepresentativeCtrl.create));

/**
 * load customerRepresentatives by query
 */
router.post('/load', NormalUserCtrl.checkAuth, catchError(CustomerRepresentativeCtrl.loadByQuery));

/**
 * get customerRepresentative
 */
router.get('/:id', UserCtrl.checkAuth, catchError(CustomerRepresentativeCtrl.get));

/**
 * edit customerRepresentative
 */
router.put('/:id', UserCtrl.checkAuth, catchError(CustomerRepresentativeCtrl.update));

/**
 * remove customerRepresentative
 */
router.delete('/:id', UserCtrl.checkAuth, catchError(CustomerRepresentativeCtrl.remove));


module.exports = router;
