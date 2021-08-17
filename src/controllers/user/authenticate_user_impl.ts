import { IUserCredentials, IUserRequest } from '@entities/authentication';
import { dbConn } from '@init/database_client';
import { hash, compare } from 'bcrypt';
import { User } from '@prisma/client';

export class AuthenticateUserImpl {
  async execute({
    username,
    email,
    password,
  }: IUserCredentials): Promise<{ user: User; err: Error }> {
    // Checks if the user exists
    const userFound = await dbConn.user.findFirst({
      where: {
        username: username,
        OR: {
          email: email,
        },
      },
    });

    let isValid = !!userFound?.id;
    if (isValid) {
      isValid = await compare(password, userFound.password);
    }

    if (!isValid) {
      return {
        user: null,
        err: new Error(
          'User with provided email/username and password not found'
        ),
      };
    }

    return { user: userFound, err: null };
  }
}
