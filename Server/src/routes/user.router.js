import { Router } from "express";
import multiparty from 'connect-multiparty'
import { addUserController,updateUserController,getAllUsers,deleteUser } from "../controllers/user.controller.js";
import { userAuthenticated } from "../middleware/authorization.js";


const multipartyMiddleware = multiparty({uploadDir: 'src/uploads/users'})
export const userRouter = Router()
// userRouter.use(userAuthenticated)

userRouter.post('/register',multipartyMiddleware,addUserController)
userRouter.patch('/',userAuthenticated,multipartyMiddleware,updateUserController)
userRouter.get('/all',userAuthenticated,getAllUsers)
// userRouter.get('/image',userAuthenticated,imageUser)
userRouter.delete('/',userAuthenticated,deleteUser)