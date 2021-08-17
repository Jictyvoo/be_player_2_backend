import { AuthenticationController } from '@controllers/user/authentication_controller';
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

export async function userRouter(
  server: FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse,
    FastifyLoggerInstance
  >
) {
  const authController = new AuthenticationController();

  server.put<{}>('/signin', authController.createUser);
  server.post('/login', authController.login);
}
