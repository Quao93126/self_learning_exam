import { Router } from "express"; // Importing the Router class from express
// Importing the controller functions
import { 
    registerUserController, 
    deleteUserController, 
    getByIdUserController, 
    getUserController, 
    loginUserController, 
    updateUserController 
} from "../controller/user-controller"; // Importing user-related controller functions from the user-controller file
import verifyToken from "../middleware/auth-middleware"; // Importing middleware function to verify tokens

const userRouter = Router(); // Creating a new Router instance
// Route for '/user' path
userRouter.route('/').get(verifyToken, getUserController).post(registerUserController);
// Route for '/user/:id' path
userRouter.route('/:id').get(getByIdUserController).delete(verifyToken, deleteUserController).put(updateUserController);
// Route for '/user/login' path
userRouter.route('/login').post(loginUserController)

export default userRouter; // Exporting the userRouter instance for use in other parts of the application
