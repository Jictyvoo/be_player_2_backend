import { CreateUserController } from '@controllers/user/authentication_controller';
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { DefaultReply, DefaultRequest } from '@p2Types/default_types';

export function userRouter(
  server: FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse,
    FastifyLoggerInstance
  >
) {
  const userCreateController = new CreateUserController();

  server.post<{}>('/users', userCreateController.handle);
  server.get('/', async (request: DefaultRequest, reply: DefaultReply) => {
    return 'pong\n';
  });
}
