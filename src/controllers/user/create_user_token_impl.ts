import { IUserToken } from '@entities/authentication';
import { dbConn } from '@init/database_client';
import { AuthToken } from '@prisma/client';

export class CreateUserTokenImpl {
  async execute(
    userToken: IUserToken,
    expirationDate: Date
  ): Promise<AuthToken> {
    // Start the user creation
    const authToken = await dbConn.authToken.upsert({
      create: { userId: userToken.id, expires_at: expirationDate },
      update: {
        expires_at: expirationDate,
        refresh_token: userToken.refreshToken,
      },
      where: {
        userId: userToken.id,
      },
    });

    return authToken;
  }
}
