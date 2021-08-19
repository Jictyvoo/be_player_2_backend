import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export async function enterpriseRouter(server: FastifyInstance) {
  server.post<{}>(
    '/enterprises',
    async (request: FastifyRequest, reply: FastifyReply) => {
      return 'Update the enterprises\n';
    }
  );
  server.get(
    '/enterprises',
    async (request: FastifyRequest, reply: FastifyReply) => {
      return 'List all enterprises\n';
    }
  );
}
