import { Router } from 'express';

import { isAuthenticated } from '../../middlewares';
import {
    createOrderForGuest,
    createOrderForUser,
    deleteOrder,
    editOrderInformation,
    getListOrder,
    getOrderDetail,
    updateOrderStatusAfterPayment,
} from '../controllers/order';

export default (router: Router) => {
    router.get('/my-order', isAuthenticated, getListOrder);
    router.get('/order-detail/:id', getOrderDetail);
    router.put('/my-order/edit/:id', editOrderInformation);
    router.delete('/my-order/delete/:id', deleteOrder);
    router.post('/my-order/user/create', isAuthenticated, createOrderForUser);
    router.post('/my-order/guest/create', createOrderForGuest);
    router.put(
        '/order/update-status-after-payment/:id',
        updateOrderStatusAfterPayment
    );
};
