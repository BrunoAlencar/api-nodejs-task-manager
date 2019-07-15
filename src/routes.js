import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import GoalController from './app/controllers/GoalController';
import SubgoalController from './app/controllers/SubgoalController';

import authMiddleware from '../src/app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/goals', GoalController.store);
routes.get('/goals', GoalController.index);
routes.put('/goals', GoalController.update);

routes.post('/subgoals', SubgoalController.store);

export default routes;
