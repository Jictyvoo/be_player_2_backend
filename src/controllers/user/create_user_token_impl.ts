import { IUserToken } from '@entities/authentication';
import { dbConn } from '@init/database_client';
import { RefreshToken } from '@prisma/client';

export class CreateUserTokenImpl {
  async execute(
    userToken: IUserToken,
    expirationDate: Date
  ): Promise<RefreshToken> {
    // Start the user creation
    const authToken = await dbConn.refreshToken.upsert({
      create: { userId: userToken.id, expiresAt: expirationDate },
      update: {
        expiresAt: expirationDate,
        sessionToken: userToken.sessionToken,
      },
      where: {
        userId: userToken.id,
      },
    });

    return authToken;
  }
}
