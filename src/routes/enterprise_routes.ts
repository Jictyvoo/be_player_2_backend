import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { DefaultReply, DefaultRequest } from '../util/default_types';

export function enterpriseRouter(
  server: FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse,
    FastifyLoggerInstance
  >
) {
  server.post<{}>(
    '/enterprises',
    async (request: DefaultRequest, reply: DefaultReply) => {
      return 'Update the enterprises\n';
    }
  );
  server.get(
    '/enterprises',
    async (request: DefaultRequest, reply: DefaultReply) => {
      return 'List all enterprises\n';
    }
  );
}
