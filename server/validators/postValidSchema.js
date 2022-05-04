const {body} = require('express-validator');

module.exports = [
  body('title').notEmpty().isLength({min: 2}).withMessage('Minimum 2 characters of title!'),
  body('description').notEmpty().isLength({min: 10}).withMessage('Minimum 10 characters of description!')
]
