import { Router } from 'express';
import { CreateUserController } from './usecases/create_user/create_user_controller';

const router = Router();

const userCreateController = new CreateUserController();

router.post('/users', userCreateController.handle);

export { router };
