const express = require('express');

const WarehouseCtrl = require('../../controllers/admin/warehouse');

const UserCtrl = require('../../controllers/admin/user');
const NormalUserCtrl = require('../../controllers/user');
const { catchError } = require('../../controllers/error');

const router = express.Router();
/**
 * create warehouse
 */
router.post('/', UserCtrl.checkAuth, catchError(WarehouseCtrl.create));

/**
 * load warehouses by query
 */
router.post(
  '/load',
  NormalUserCtrl.checkAuth,
  catchError(WarehouseCtrl.loadByQuery)
);

/**
 * get warehouse
 */
router.get('/:id', UserCtrl.checkAuth, catchError(WarehouseCtrl.get));

/**
 * edit warehouse
 */
router.put('/:id', UserCtrl.checkAuth, catchError(WarehouseCtrl.update));

/**
 * remove warehouse
 */
router.delete('/:id', UserCtrl.checkAuth, catchError(WarehouseCtrl.remove));

/**
 * set / unset default warehouse
 */
router.post(
  '/set-default/:id',
  UserCtrl.checkAuth,
  catchError(WarehouseCtrl.setDefault)
);

module.exports = router;
