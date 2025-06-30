import { Router } from "express";
import userController from '../controllers/users.controller.js';
import validate from "../validators/validate.js";
import { createUserSchema } from "../validators/user.validate.js";
import { authenticateToken } from '../middlewares/authenticate.js';



const router = Router();

//Routes
//router.get("/", userController.getUsers); // GET /api/users
//router.post("/", userController.createUser); // POST /api/users

//router.route('/').get(userController.getUsers) // GET /api/users
  //               .post(userController.createUser); // POST /api/users

router
    .route('/')
    .get(userController.getUsers) // GET /api/users                
    .post(validate(createUserSchema, 'body'), userController.createUser); // POST /api/users

router
    .route('/:id')
    .get(authenticateToken, userController.getUser) // GET /api/users/:id
    .put(authenticateToken, userController.updateUser)// PUT /api/users/:id
    .delete(authenticateToken, userController.deleteUser)
    .patch(authenticateToken, userController.activateInactivate); // PATCH /api/users/:id


router.get('/:id/tasks', authenticateToken, userController.getTasks); 

router.get('/list/pagination', userController.getUsersPaginated);



    export default router;  