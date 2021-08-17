import { IUserRequest } from '@entities/authentication';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserImpl } from './create_user_impl';
import { AuthenticateUserImpl } from './authenticate_user_impl';
import { CreateUserTokenImpl } from './create_user_token_impl';
import { HttpStatusCode } from '@util/status_codes';
import { createPayload } from '@util/payload_helper';
import { defaultEnv } from '@init/environment';
import { v4 as uuidv4 } from 'uuid';

const REFRESH_TOKEN_LIFETIME = 30; // days

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

    const createTokenImpl = new CreateUserTokenImpl();
    const expirationDate = new Date(
      new Date().getTime() + REFRESH_TOKEN_LIFETIME * 24 * 60 * 60000
    );

    const refreshToken = uuidv4();
    const authToken = await createTokenImpl.execute(
      { id: authResult.user.id, refreshToken: refreshToken },
      expirationDate
    );

    const encryptToken = await createPayload(
      authToken.id,
      new Date(new Date().getTime() + 3 * 60 * 60000),
      defaultEnv.secretKey
    );
    return reply
      .status(HttpStatusCode.OK)
      .header('Authorization', encryptToken)
      .send({
        refreshToken: authToken.refresh_token,
        expiresAt: authToken.expires_at,
      });
  }
}
