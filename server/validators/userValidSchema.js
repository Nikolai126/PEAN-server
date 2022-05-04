const { body } = require('express-validator');

const signUpSchema = [
  body('firstname').isLength({ min: 2 }).withMessage('Minimum 2 characters in firstname'),
  body('lastname').isLength({ min: 2 }).withMessage('Minimum 2 characters in lastname'),
  body('email').isEmail().normalizeEmail().withMessage('Incorrect email'),
  body('password').isLength({ min: 6 }).withMessage('Minimum 6 characters in password')
];

const authSchema = [
  body('email').isEmail().normalizeEmail().withMessage('Incorrect email'),
  body('password').isLength({ min: 6 }).withMessage('Minimum 6 characters in password')
]

module.exports = {signUpSchema, authSchema};
