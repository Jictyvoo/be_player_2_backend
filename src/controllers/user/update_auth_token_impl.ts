import { dbConn } from '@init/database_client';
import { AuthToken } from '@prisma/client';

export class UpdateAuthTokenImpl {
  async execute(
    refreshID: string,
    tempToken: string,
    expirationDate: Date
  ): Promise<{ token?: AuthToken; err?: Error }> {
    // Start the user creation

    const foundToken = await dbConn.authToken.findFirst({
      where: {
        id: refreshID,
        AND: {
          expires_at: {
            gte: new Date(),
          },
        },
      },
    });

    if (!foundToken) {
      return { err: new Error('Invalid refresh-token') };
    }

    const authToken = await dbConn.authToken.update({
      data: {
        expires_at: expirationDate,
        refresh_token: tempToken,
      },
      where: {
        id: refreshID,
      },
    });

    return { token: authToken };
  }
}
