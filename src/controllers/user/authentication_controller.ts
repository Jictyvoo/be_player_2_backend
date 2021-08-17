import { IUserRequest } from '@entities/authentication';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserImpl } from './authenticate_user';

export class CreateUserController {
  async handle(request: FastifyRequest<IUserRequest>, reply: FastifyReply) {
    const toCreate = request.body as IUserRequest;

    const createUserImpl = new CreateUserImpl();

    const user = await createUserImpl.execute({
      name: toCreate.name,
      username: toCreate.username,
      email: toCreate.email,
      password: toCreate.password,
    });

    return reply.status(201).send(user);
  }
}
