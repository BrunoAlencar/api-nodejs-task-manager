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

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */

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
