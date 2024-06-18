import { Router } from 'express';
import { addFeedback } from '../controllers/feedback/index';
import { isAuthenticated } from '../../middlewares/index';

export default (router: Router) => {
    router.post('/feedback/add', isAuthenticated, addFeedback);
};
