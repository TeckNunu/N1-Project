import { Router } from 'express';

import { addToCart, getListCart } from '../controllers/cart';

import { isAuthenticated } from '../../middlewares/index';

export default (router: Router) => {
    // Auth route
    router.get('/cart', getListCart);
    router.post('/cart/add', isAuthenticated, addToCart);
};
