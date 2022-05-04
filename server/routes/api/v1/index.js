const { Router } = require('express');
const {signUpSchema, authSchema} = require('../../../validators/userValidSchema');
const resultUserValidation = require('../../../validators/userValidationResult');
const userController = require('../../../controllers/user-controller');
const postValidSchema = require('../../../validators/postValidSchema');
const postValidResult = require('../../../validators/postValidResult');
const postController = require('../../../controllers/post-controller');
const tokenGuard = require('../../../middleware/token-guard');
const uploadImage = require('../../../middleware/multerConfig')

module.exports = Router()
  .get('/home', postController.getAllPosts)
  .get('/home/:id', postController.getOnePost)
  .post('/sign-in', authSchema, resultUserValidation, userController.signIn)
  .post('/sign-up', signUpSchema, resultUserValidation, userController.signUp)
  .get('/home/filter/:id', postController.filterPosts)
  .post('/refresh', userController.refresh)
  .use(tokenGuard)
  .get('/home/like/:id/', postController.settingLike)
  .get('/get-email', userController.getEmail)
  .get('/logout', userController.logout)
  .post('/create-post', uploadImage, postValidSchema, postValidResult, postController.createPost)
  .put('/home/:id', uploadImage, postValidSchema, postValidResult, postController.editPost)
  .delete('/home/:id', postController.deletePost);


