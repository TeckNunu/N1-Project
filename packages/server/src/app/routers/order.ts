import { Router } from 'express';

import { isAuthenticated } from '../../middlewares';
import { getListOrder } from '../controllers/order';

export default (router: Router) => {
    router.get('/my-order', isAuthenticated, getListOrder);
};
