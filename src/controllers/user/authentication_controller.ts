import { IUserRequest } from '@entities/authentication';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserImpl } from './create_user_impl';
import { AuthenticateUserImpl } from './authenticate_user_impl';
import { HttpStatusCode } from '@util/status_codes';

export class AuthenticationController {
  async createUser(request: FastifyRequest<IUserRequest>, reply: FastifyReply) {
    const toCreate = request.body as IUserRequest;

    const createUserImpl = new CreateUserImpl();

    const user = await createUserImpl.execute({
      name: toCreate.name,
      username: toCreate.username,
      email: toCreate.email,
      password: toCreate.password,
    });

    return reply.status(HttpStatusCode.Created).send(user);
  }

  async login(request: FastifyRequest<IUserRequest>, reply: FastifyReply) {
    const credentials = request.body as IUserRequest;
    const loginUserImpl = new AuthenticateUserImpl();

    const authResult = await loginUserImpl.execute({
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
    });

    if (authResult.err) {
      return reply
        .status(HttpStatusCode.PreconditionFailed)
        .send(authResult.err);
    }

    return reply.status(HttpStatusCode.OK).send(authResult.user);
  }
}
