import { Router } from 'express';

import {
    addToCart,
    deleteCartProduct,
    getListCart,
    getListCartLatest,
    updateQuantity,
} from '../controllers/cart';

import { isAuthenticated } from '../../middlewares/index';

export default (router: Router) => {
    // Auth route
    router.get('/cart', isAuthenticated, getListCart);
    router.delete('/cart/delete/:id', deleteCartProduct);
    router.post('/cart/add', isAuthenticated, addToCart);
    router.put('/cart/updateQuantity/:id', updateQuantity);
    router.get('/cart-latest', isAuthenticated, getListCartLatest);
};
