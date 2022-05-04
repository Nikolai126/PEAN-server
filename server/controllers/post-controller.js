const PostService = require('../services/post-service');
const UserService = require('../services/user-service');
const ErrorApi = require('../exceptions/error-api');

class PostController {

  async createPost (req, res, next) {
    try {
      const userDataForPost = await UserService.getUserData(req.cookies.refreshToken);
      let tagData = [];

      if (req.body.tags) {
        const arrayOfTags = (req.body.tags).split(',');
        for (let i = 0; i < arrayOfTags.length; i++) {
          arrayOfTags[i] = (arrayOfTags[i].trim()).toLowerCase();
          tagData[i] = await PostService.createTag((arrayOfTags[i]).toString());
        }
      }

      const postParams = {
        title: req.body.title,
        description: req.body.description,
        user_id: userDataForPost.id,
        tag_id: tagData[0] ? tagData : undefined,
        image_ref: req.file?.filename,
        date: req.body.date,
        firstname: userDataForPost.dataValues.firstname,
        lastname: userDataForPost.dataValues.lastname,
      };

      const createdPost = await PostService.createPost(postParams);
      if (createdPost) {
        return res.status(200).send({ message: 'Post created successfully!'});
      }
      return next(ErrorApi.BadRequest('Troubles with creating post, try again...'));
    } catch (err) {
      next(err);
    }

  }

  async editPost (req, res, next) {
    try {
      const postParams = {
        id: +req.body.id,
        title: req.body.title,
        description: req.body.description,
        image_ref: req.file?.filename,
      };

      const editedPost = await PostService.editPost(postParams);
      if (editedPost) {
        return res.status(200).send({ message: 'Post updated successfully!'});
      }
      return next(ErrorApi.BadRequest('Troubles with updating post, try again...'));
    } catch (err) {
      next(err);
    }
  }

  async getOnePost (req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const postId = +req.params.id;
      const onePostData = await PostService.getOnePost(refreshToken, postId);
      return res.status(200).send(JSON.stringify(onePostData));
    } catch (err) {
      next(err);
    }
  }

  async getAllPosts (req, res, next) {
    try {
      const allPosts = await PostService.gettingAllPosts();
      return res.status(200).send(JSON.stringify(allPosts));
    } catch (err) {
      next(err);
    }
  }

  async filterPosts (req, res, next) {
    try {
      const tagsPosts = await PostService.filterPosts(+req.params.id);
      return res.status(200).send(JSON.stringify(tagsPosts));
    } catch (err) {
      next(err);
    }
  }

  async settingLike (req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const postId = +req.params.id;
      const modifyPostData = await PostService.setLike(refreshToken, postId);
      if (modifyPostData) {
        return res.status(200);
      }
      return res.status(400)
    } catch (err) {
      next(err);
    }

  }

  async deletePost (req, res, next) {
    try {
      const deletedPost = await PostService.deleteImageRef(+req.params.id).then(() => {
        return PostService.deletingPost(+req.params.id, req.cookies.refreshToken);
      })
      if (deletedPost) {
        return res.status(200);
      }
      else {
        return res.status(400);
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostController();
