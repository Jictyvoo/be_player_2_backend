import { CreateUserImpl } from './authenticate_user';

export class CreateUserController {
  async handle(request: any, response: any) {
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
