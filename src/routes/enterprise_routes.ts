import { pasetoware } from '@middlewares/pasetoware';
import { pasetoPrivateKey } from '@providers/payload_provider';
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from 'fastify';

import {
  createEnterprise,
  deleteEnterprise,
  editEnterprise,
  listEnterprise,
} from '@controllers/enterprise/enterprise_controller';

const _enterpriseRouter: FastifyPluginAsync = async function (
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
) {
  fastify.addHook('preParsing', pasetoware({ key: pasetoPrivateKey }));

  fastify.post('/enterprises', editEnterprise);
  fastify.get('/enterprises', listEnterprise);
  fastify.put('/enterprises', createEnterprise);
  fastify.delete('/enterprises', deleteEnterprise);
};

export const EnterpriseRouter = _enterpriseRouter;
