import { Request, Response } from 'express';
import { CreateUserImpl } from './authenticate_user';

export class CreateUserController {
  async handle(request: Request, response: Response) {
    const { email, username, name, password } = request.body;

    const createUserImpl = new CreateUserImpl();

    const user = await createUserImpl.execute({
      name,
      username,
      email,
      password,
    });

    return response.json(user);
  }
}
