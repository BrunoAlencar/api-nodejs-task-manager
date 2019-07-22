import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import GoalController from './app/controllers/GoalController';
import SubgoalController from './app/controllers/SubgoalController';
import GoalReachedController from './app/controllers/GoalReachedController';
import AvatarController from './app/controllers/AvatarController';

import authMiddleware from '../src/app/middlewares/auth';

const routes = new Router();
const upload = new multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.post('/recover', UserController.recover);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/goals', GoalController.store);
routes.get('/goals', GoalController.index);
routes.put('/goals', GoalController.update);
routes.get('/goals/types', GoalController.getTypes);

routes.post('/subgoals', SubgoalController.store);
routes.get('/subgoals/types', SubgoalController.getTypes);
routes.put('/subgoals', SubgoalController.update);
routes.get('/subgoals/:idgoal', SubgoalController.index);

routes.get('/goalreached', GoalReachedController.store);
routes.put('/goalreached', GoalReachedController.update);
routes.get('/goalreached/:subgoal_id', GoalReachedController.index);

routes.post('/avatars', upload.single('avatar'), AvatarController.store);

export default routes;
