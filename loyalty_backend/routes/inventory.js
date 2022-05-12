const express = require('express');

const InventoryCtrl = require('../controllers/inventory');

const UserCtrl = require('../controllers/user');
const { catchError } = require('../controllers/error');

const router = express.Router();
/**
 * create inventory
 */
router.post('/', UserCtrl.checkAuth, catchError(InventoryCtrl.create));

/**
 * get inventory list
 */
router.get('/', UserCtrl.checkAuth, catchError(InventoryCtrl.getAll));

/**
 * load inventorys by query
 */
router.post('/load', UserCtrl.checkAuth, catchError(InventoryCtrl.loadByQuery));

/**
 * get inventory
 */
router.get('/:id', UserCtrl.checkAuth, catchError(InventoryCtrl.get));

/**
 * get inventory and related data, for ex: customer
 */
router.get(
  '/related/:id',
  UserCtrl.checkAuth,
  catchError(InventoryCtrl.getAlsoRelated)
);

/**
 * edit inventory
 */
router.put('/:id', UserCtrl.checkAuth, catchError(InventoryCtrl.update));

/**
 * remove inventory
 */
router.delete('/:id', UserCtrl.checkAuth, catchError(InventoryCtrl.remove));

/**
 * create bulk inventory
 */
router.post(
  '/create-bulk',
  UserCtrl.checkAuth,
  catchError(InventoryCtrl.createBulk)
);

/**
 * create bulk inventory
 */
router.post(
  '/load-transaction',
  UserCtrl.checkAuth,
  catchError(InventoryCtrl.loadByQueryTransaction)
);

module.exports = router;
