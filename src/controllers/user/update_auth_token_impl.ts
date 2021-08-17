import { dbConn } from '@init/database_client';
import { RefreshToken } from '@prisma/client';

export class UpdateAuthTokenImpl {
  async execute(
    refreshID: string,
    tempToken: string,
    expirationDate: Date
  ): Promise<{ token?: RefreshToken; err?: Error }> {
    // Start the user creation

    const foundToken = await dbConn.refreshToken.findFirst({
      where: {
        id: refreshID,
        AND: {
          expiresAt: {
            gte: new Date(),
          },
        },
      },
    });

    if (!foundToken) {
      return { err: new Error('Invalid refresh-token') };
    }

    const authToken = await dbConn.refreshToken.update({
      data: {
        expiresAt: expirationDate,
        sessionToken: tempToken,
      },
      where: {
        id: refreshID,
      },
    });

    return { token: authToken };
  }
}
