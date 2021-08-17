import { RouteGenericInterface } from 'fastify/types/route';

export interface IUserRequest extends RouteGenericInterface {
  name: string;
  password: string;
  username: string;
  email: string;
}
