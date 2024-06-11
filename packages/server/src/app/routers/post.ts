import { Router } from 'express';
import {
    createPost,
    deletePost,
    getListMaketer,
    getListPostManage,
    updatePost,
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
    router.get('/marketers', getListMaketer);
};
