import { pasetoware } from '@middlewares/pasetoware';
import { pasetoPrivateKey } from '@providers/payload_provider';
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from 'fastify';

import { deleteEnterprise } from '@controllers/enterprise/enterprise_controller';

const _enterpriseRouter: FastifyPluginAsync = async function (
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
) {
  fastify.addHook('preParsing', pasetoware({ key: pasetoPrivateKey }));

  fastify.get('/enterprises', async (request, reply) => {
    return reply.send({ message: 'Hum, nice' });
  });
  fastify.put('/enterprises', async (request, reply) => {});
  fastify.delete('/enterprises', deleteEnterprise);
};

export const EnterpriseRouter = _enterpriseRouter;
