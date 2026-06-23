import { Router } from 'express';
import { getCustomers, createCustomer } from '../controllers/customer.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const customerRouter = Router();
customerRouter.get('/', authenticate, getCustomers);
customerRouter.post('/', authenticate, createCustomer);
