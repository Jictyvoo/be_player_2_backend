import { IUserRequest } from '@entities/authentication';
import { dbConn } from '@init/database_client';
import { hash } from 'bcrypt';
import { User } from '@prisma/client';

export class CreateUserImpl {
  async execute({
    name,
    username,
    email,
    password,
  }: IUserRequest): Promise<User> {
    // Checks if the user already exists
    const isExistentUser = await dbConn.user.findFirst({
      where: {
        email,
      },
    });

    if (isExistentUser) {
      throw new Error('User cannot be created!');
    }

    const passwordHash = await hash(password, 8);

    // Start the user creation
    const newUser = await dbConn.user.create({
      data: {
        name: name,
        username: username,
        email: email,
        password: passwordHash,
      },
    });

    return newUser;
  }
}
