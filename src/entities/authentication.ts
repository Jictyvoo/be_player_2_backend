import { RouteGenericInterface } from 'fastify/types/route';

export interface IUserCredentials extends RouteGenericInterface {
  password: string;
  username: string;
  email: string;
}

export interface IUserRequest extends IUserCredentials {
  name: string;
}

export interface IUserToken extends RouteGenericInterface {
  id: string;
  refreshToken: string;
}
