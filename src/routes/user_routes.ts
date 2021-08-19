import { AuthenticationController } from '@controllers/user/authentication_controller';
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from 'fastify';
import fp from 'fastify-plugin';

const _userRouter: FastifyPluginAsync = async function (
  instace: FastifyInstance,
  _options: FastifyPluginOptions
) {
  const authController = new AuthenticationController();

  instace.put('/signin', authController.createUser);
  instace.post('/login', authController.login);
  instace.patch('/refresh', authController.refresh);
};

export const UserRouter = fp(_userRouter);
