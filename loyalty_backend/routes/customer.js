const express = require('express');

const UserCtrl = require('../controllers/user');
const CustomerCtrl = require('../controllers/customer');
const { catchError } = require('../controllers/error');

const router = express.Router();

/**
 * create customer
 */
router.post('/', UserCtrl.checkAuth, catchError(CustomerCtrl.create));

/**
 * get customers for Customer Selecting Dropbox
 */
router.post(
  '/easy-search',
  UserCtrl.checkAuth,
  catchError(CustomerCtrl.getEasySearch)
);

/**
 * load customers by query
 */
router.post('/load', UserCtrl.checkAuth, catchError(CustomerCtrl.loadByQuery));

/**
 * get customer
 */
router.get('/:id', UserCtrl.checkAuth, catchError(CustomerCtrl.get));

/**
 * edit customer
 */
router.put('/:id', UserCtrl.checkAuth, catchError(CustomerCtrl.update));

/**
 * remove customer
 */
router.delete('/:id', UserCtrl.checkAuth, catchError(CustomerCtrl.remove));

module.exports = router;
