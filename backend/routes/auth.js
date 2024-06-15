const router = require('express').Router();
const { asyncHandler } = require('../middleware/asyncHandler.js');
const checkEmail = require('../middleware/checkEmail');
const { signup: signupValidator, signin: signinValidator } = require('../validators/auth.js');
const authController = require('../controllers/authController');


router.route('/signup')
    .post(signupValidator, asyncHandler(checkEmail), asyncHandler(authController.signup));

router.route('/signin')
    .post(signinValidator, asyncHandler(authController.signin));

module.exports = router;