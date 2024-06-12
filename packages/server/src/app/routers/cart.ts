import { Router } from 'express';
import { addToCart } from '../controllers/cart/cart';
import { isAuthenticated } from '../../middlewares/index';

export default (router: Router) => {
    router.post('/cart/add', isAuthenticated, addToCart);
};
