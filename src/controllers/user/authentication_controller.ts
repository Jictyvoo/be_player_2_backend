import { IUserRequest } from '@entities/authentication';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserImpl } from './create_user_impl';
import { CreateUserTokenImpl } from './create_user_token_impl';
import { AuthenticateUserImpl } from './authenticate_user_impl';
import { UpdateAuthTokenImpl } from './update_auth_token_impl';
import { HttpStatusCode } from '@util/status_codes';
import { HttpHeaders } from '@util/http_headers';
import { createPayload } from '@providers/payload_helper';
import { defaultEnv } from '@init/environment';
import { v4 as uuidv4 } from 'uuid';

const REFRESH_TOKEN_LIFETIME = 30; // days
const TOKEN_LIFETIME = 3 * 60; // hours

function getExpirationDate(): Date {
  return new Date(
    new Date().getTime() + REFRESH_TOKEN_LIFETIME * 24 * 60 * 60000
  );
}

async function createTempToken(payload: any): Promise<string> {
  return await createPayload(
    payload,
    new Date(new Date().getTime() + TOKEN_LIFETIME * 60000),
    defaultEnv.secretKey
  );
}

export class AuthenticationController {
  async createUser(request: FastifyRequest<IUserRequest>, reply: FastifyReply) {
    const toCreate = request.body as IUserRequest;

    const createUserImpl = new CreateUserImpl();

    const createResult = await createUserImpl.execute({
      name: toCreate.name,
      username: toCreate.username,
      email: toCreate.email,
      password: toCreate.password,
    });
    if (createResult.err) {
      return reply
        .status(HttpStatusCode.PreconditionFailed)
        .send(createResult.err);
    }

    return reply.status(HttpStatusCode.Created).send(createResult.user);
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
    const expirationDate = getExpirationDate();

    const refreshToken = uuidv4();
    const authToken = await createTokenImpl.execute(
      { id: authResult.user.id, sessionToken: refreshToken },
      expirationDate
    );

    const encryptToken = createTempToken(authToken.sessionToken);
    return reply
      .status(HttpStatusCode.OK)
      .header(HttpHeaders.Authorization, encryptToken)
      .send({
        refreshToken: authToken.id,
        expiresAt: authToken.expiresAt,
      });
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const reqData = request.body as { 'refresh-token': string };
    if (!reqData['refresh-token'] || reqData['refresh-token']?.length <= 0) {
      return reply
        .status(HttpStatusCode.BadRequest)
        .send(new Error('Refresh-token is missed from the request'));
    }

    const updateAuthTokenImpl = new UpdateAuthTokenImpl();

    const refreshToken = uuidv4();
    const refreshResult = await updateAuthTokenImpl.execute(
      reqData['refresh-token'] ?? '',
      refreshToken,
      getExpirationDate()
    );

    if (refreshResult.err) {
      return reply.status(HttpStatusCode.BadRequest).send(refreshResult.err);
    }

    const tokenData = refreshResult.token;
    const encryptToken = await createTempToken(tokenData.sessionToken);
    return reply.header(HttpHeaders.Authorization, encryptToken).send({
      refreshToken: tokenData.id,
      expiresAt: tokenData.expiresAt,
    });
  }
}
