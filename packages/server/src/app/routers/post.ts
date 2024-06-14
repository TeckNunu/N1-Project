import { Router } from 'express';
import {
    createPost,
    deletePost,
    getListMaketer,
    getListPostManage,
    updatePost,
    updatePostFeatured,
    updatePostStatus,
} from '../controllers/post/marketer-post';
import { getListPost, getPostById } from '../controllers/post';

export default (router: Router) => {
    // Auth route
    router.get('/manage/post', getListPostManage);
    router.post('/post/create', createPost);
    router.get('/post/:id', getPostById);
    router.put('/post/update/:id', updatePost);
    router.delete('/post/delete/:id', deletePost);
    router.get('/post', getListPost);
    router.put('/post/updateStatus/:id', updatePostStatus);
    router.put('/post/updateFeatured/:id', updatePostFeatured);
    router.get('/marketers', getListMaketer);
};
