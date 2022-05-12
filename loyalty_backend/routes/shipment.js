const express = require('express');

const ShipmentCtrl = require('../controllers/shipment');

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v1: uuidv1 } = require('uuid');
const mime = require('mime-types');

const api = require('../config/api');
const fs = require('fs');

const s3 = new AWS.S3({
  accessKeyId: api.AWS.AWS_ACCESS_KEY,
  secretAccessKey: api.AWS.AWS_SECRET_ACCESS_KEY,
  region: api.AWS.AWS_S3_REGION,
});

const UserCtrl = require('../controllers/user');
const { catchError } = require('../controllers/error');
const { FILES_PATH } = require('../config/path');

const router = express.Router();
const path = require('path');

const storage = multerS3({
  s3,
  bucket: api.AWS.AWS_S3_BUCKET_NAME,
  acl: 'public-read',
  metadata(req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key(req, file, cb) {
    const today = new Date();
    const year = today.getYear();
    const month = today.getMonth();
    cb(
      null,
      'loyalty' +
        year +
        '/' +
        month +
        '/' +
        uuidv1() +
        '.' +
        mime.extension(file.mimetype)
    );
  },
});

const fileStorage = multer.diskStorage({
  destination: function fn(req, file, cb) {
    const uploadPath = path.join(FILES_PATH, 'shipment', req.params.id + '/');

    if (!fs.existsSync(FILES_PATH)) {
      fs.mkdirSync(FILES_PATH);
    }
    const dirShipment = path.join(FILES_PATH, 'shipment');
    if (!fs.existsSync(dirShipment)) {
      fs.mkdirSync(dirShipment);
    }
    const dirShipmentDetail = path.join(FILES_PATH, 'shipment', req.params.id);
    if (!fs.existsSync(dirShipmentDetail)) {
      fs.mkdirSync(dirShipmentDetail);
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // cb(null, file.originalname);
    cb(null, 'shipment.pdf');
  },
});

const uploadS3 = multer({ storage });
const upload = multer({ storage: fileStorage });
/**
 * create shipment
 */
router.post('/', UserCtrl.checkAuth, catchError(ShipmentCtrl.create));

/**
 * get shipment list
 */
router.get('/', UserCtrl.checkAuth, catchError(ShipmentCtrl.getAll));

/**
 * load shipments by query
 */
router.post('/load', UserCtrl.checkAuth, catchError(ShipmentCtrl.loadByQuery));

/**
 * get shipment
 */
router.get('/:id', UserCtrl.checkAuth, catchError(ShipmentCtrl.get));

/**
 * get shipment and related data, for ex: customer
 */
router.get(
  '/related/:id',
  UserCtrl.checkAuth,
  catchError(ShipmentCtrl.getAlsoRelated)
);

/**
 * edit shipment
 */
router.put('/:id', UserCtrl.checkAuth, catchError(ShipmentCtrl.update));

/**
 * remove shipment
 */
router.delete('/:id', UserCtrl.checkAuth, catchError(ShipmentCtrl.remove));

// send Email
router.post(
  '/send-email/:id',
  UserCtrl.checkAuth,
  upload.single('pdfFile'),
  catchError(ShipmentCtrl.sendEmail)
);

// send Text
router.post(
  '/send-text/:id',
  UserCtrl.checkAuth,
  uploadS3.single('pdfFile'),
  catchError(ShipmentCtrl.sendText)
);

// send Fax
router.post(
  '/send-fax/:id',
  UserCtrl.checkAuth,
  upload.single('pdfFile'),
  catchError(ShipmentCtrl.sendFax)
);

// search Addresses
router.post(
  '/search-addresses',
  UserCtrl.checkAuth,
  catchError(ShipmentCtrl.searchAddresses)
);

// Upload photo
router.post(
  '/upload-photo',
  UserCtrl.checkAuth,
  uploadS3.single('photo'),
  catchError(ShipmentCtrl.uploadPhoto)
);

/**
 * global search
 */
router.get(
  '/global-search/:search_text',
  UserCtrl.checkAuth,
  catchError(ShipmentCtrl.globalSearch)
);

module.exports = router;
