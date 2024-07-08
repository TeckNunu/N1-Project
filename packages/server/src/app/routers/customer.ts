import { Router } from 'express';
import { getCustomerCms } from '../controllers/customer/customer-cms';
import { isAuthenticated, isMarketer } from '../../middlewares';

export default (router: Router) => {
    router.get('/customer', isAuthenticated, isMarketer, getCustomerCms);
};
