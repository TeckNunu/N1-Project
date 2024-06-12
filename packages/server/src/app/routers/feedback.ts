import { Router } from 'express';
import { addFeedback } from '../controllers/feedback/feedback';
import { isAuthenticated } from '../../middlewares/index';

export default (router: Router) => {
    router.post('/feedback/add', isAuthenticated, addFeedback);
};
