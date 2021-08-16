import { FastifyReply, FastifyRequest } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { Server, IncomingMessage, ServerResponse } from 'http';

export type DefaultRequest = FastifyRequest<
  RouteGenericInterface,
  Server,
  IncomingMessage
>;

export type DefaultReply = FastifyReply<
  Server,
  IncomingMessage,
  ServerResponse,
  RouteGenericInterface,
  unknown
>;
