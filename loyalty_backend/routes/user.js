const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v1: uuidv1 } = require('uuid');
const mime = require('mime-types');

const api = require('../config/api');

const s3 = new AWS.S3({
  accessKeyId: api.AWS.AWS_ACCESS_KEY,
  secretAccessKey: api.AWS.AWS_SECRET_ACCESS_KEY,
  region: api.AWS.AWS_S3_REGION,
});

const { body } = require('express-validator');

const UserCtrl = require('../controllers/user');
const { catchError } = require('../controllers/error');

const router = express.Router();

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

const upload = multer({ storage });

// Login
router.post(
  '/login',
  [body('email').isLength({ min: 3 }), body('password').isLength({ min: 1 })],
  catchError(UserCtrl.login)
);

// SignUp
router.post(
  '/',
  [
    body('email').isEmail(),
    // password must be at least 5 chars long
    body('password')
      .isLength({ min: 5 })
      .withMessage('password must be at least 5 chars long'),
    // :TODO phone number regexp should be used
    // body('phone')
    //   .isLength({ min: 9 })
    //   .matches(/^[\+\d]?(?:[\d-.\s()]*)$/)
    //   .withMessage('phone must be a valid phone number!'),
  ],
  catchError(UserCtrl.signUp)
);

// Edit own profile
router.post(
  '/me',
  UserCtrl.checkAuth,
  upload.single('avatar'),
  catchError(UserCtrl.editMe)
);

// New Password by old one
router.post(
  '/new-password',
  UserCtrl.checkAuth,
  [
    // body('old_password').isLength({ min: 5 }),
    body('new_password').isLength({ min: 5 }),
  ],
  catchError(UserCtrl.resetPasswordByOld)
);

// Forgot password
router.post('/forgot-password', catchError(UserCtrl.forgotPassword));

// Rest own profile
router.post('/reset-password', catchError(UserCtrl.resetPasswordByCode));

// Edit own profile
router.get('/me', UserCtrl.checkAuth, catchError(UserCtrl.getMe));

module.exports = router;
