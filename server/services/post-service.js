const TokenService = require('../services/token-service');
const fs = require('fs');
const path = require('path');
const { post } = require('../db/models');
const { tag } = require('../db/models');
const { like } = require('../db/models');
const { haslike } = require('../db/models');

class PostService {
  async createPost (postData) {
    return await post.create(postData);
  }

  async createTag (tagParam) {
    const newTag = await tag.findOrCreate({where: { name: tagParam } } );
    return newTag[0].dataValues.id;
  }

  async editPost (postParams) {
    const updatedPost = await post.findOne({where: { id: postParams.id } });
    if (updatedPost.dataValues.image_ref && postParams.image_ref) {
      fs.unlinkSync(path.join(__dirname, `../public/post-images/${updatedPost.dataValues.image_ref}`));
    }
    return await updatedPost.update({ title: postParams.title, description: postParams.description, image_ref: postParams.image_ref});
  }

  async getOnePost (refreshToken, postId) {
    const onePostData = (await post.findOne({where: { id: postId }})).dataValues;
    const likes = await like.findOne({where: { post_id: postId }});
    onePostData['likes'] = (likes ? likes.dataValues.value : 0);
    const arrayTags = [];

    if (onePostData.tag_id) {
      for(let i = 0; i < (onePostData.tag_id).length; i++) {
        arrayTags[i] = await tag.findOne({where: { id: onePostData.tag_id[i] } });
        onePostData.tag_id[i] = arrayTags[i].dataValues;
      }
    }

    if (refreshToken) {
      const userData = await TokenService.validateRefreshToken(refreshToken);
      const userLiked = await haslike.findOne({where: { user_id: userData.id, post_id: postId }});
      userLiked ? onePostData['haslike'] = true : onePostData['haslike'] = false;

      if (userData.id === onePostData.user_id) {
        onePostData['isAuthor'] = true;
      }
      else {
        onePostData['isAuthor'] = false;
      }
      return onePostData;
    }

    onePostData['haslike'] = false;
    return onePostData;
  }

  async deleteImageRef (postId) {
    try {
      const postData = await post.findOne({where: {id: postId}});
      if (postData.dataValues.image_ref) {
        fs.unlinkSync(path.join(__dirname, `../public/post-images/${postData.dataValues.image_ref}`));
      }
      return true;
    } catch (err) {
      return err;
    }
  }

  async setLike (refreshToken, postId) {
    if (!refreshToken) {
      return false;
    }
    const userData = await TokenService.validateRefreshToken(refreshToken);
    const yesLike = await haslike.findOne({where: {user_id: userData.id, post_id: postId}});
    const likeValue = await like.findOne({where: {post_id: postId}});

    if (yesLike) {
      if (likeValue.dataValues.value === 1) {
        await like.destroy({where: {post_id: postId}});
        await haslike.destroy({where: {user_id: userData.id, post_id: postId}});
        return true;
      }
      likeValue.decrement('value', {by: 1});
      await yesLike.destroy();
      return true;
    } else {
      const modelHaslike = {
        user_id: userData.id,
        post_id: postId
      };
      const dataVal = await haslike.create(modelHaslike);
      if (likeValue) {
        await likeValue.increment('value', {by: 1});
        return true;
      }
      else {
        const likeModel = {
          post_id: postId,
          value: 0
        }
        const createdLike = await like.create(likeModel);
        if (createdLike) {
          await createdLike.increment('value', { by: 1});
          return true;
        }
        return true;
      }
    }
  }

  async gettingAllPosts () {
    const all = await post.findAll();
    const onlyPosts = all.map(post => {
      return post.dataValues;
    });
    return onlyPosts;
  }

  async filterPosts (tagId) {
    const allPosts = await post.findAll();
    const filterPostsData = allPosts.filter(post => {
      if (post.dataValues.tag_id) {
        return post.dataValues.tag_id.includes(tagId);
      }
    });
    const filterPosts = filterPostsData.map(post => {
      return post.dataValues;
    });
    return filterPosts;
  }

  async deletingPost (postId, refreshToken) {
    const userData = await TokenService.validateRefreshToken(refreshToken);
    await haslike.destroy({where: { post_id: postId }})
    await like.destroy({where: { post_id: postId }})
    return await post.destroy({where: {id: postId, user_id: userData.id}});
  }
}

module.exports = new PostService();
