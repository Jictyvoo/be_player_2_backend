import { FastifyRequest, FastifyReply } from 'fastify';
import { IEnterpriseRequest } from '@entities/enterprise';
import { DeleteEnterpriseImpl } from './delete_enterprise_impl';
import { HttpStatusCode } from '@util/status_codes';

export const deleteEnterprise = async (
  request: FastifyRequest<IEnterpriseRequest>,
  reply: FastifyReply
) => {
  const toDelete = request.body as IEnterpriseRequest;

  const deleteEnterpriseImpl = new DeleteEnterpriseImpl();

  const deleteResult = await deleteEnterpriseImpl.execute({
    cnpj: toDelete.cnpj,
  });
  if (deleteResult.err) {
    return reply
      .status(HttpStatusCode.PreconditionFailed)
      .send(deleteResult.err);
  }

  return reply.status(HttpStatusCode.Created).send(deleteResult.enterprise);
};
