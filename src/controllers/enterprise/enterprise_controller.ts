import { FastifyRequest, FastifyReply } from 'fastify';
import { IEnterpriseRequest } from '@entities/enterprise';
import { DeleteEnterpriseImpl } from './delete_enterprise_impl';
import { ListEnterpriseImpl } from './list_enterprise_impl';
import { HttpStatusCode } from '@util/status_codes';

export const createEnterprise = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  console.log(request.query);
  return reply.status(HttpStatusCode.OK).send({});
};

export const deleteEnterprise = async (
  request: FastifyRequest<IEnterpriseRequest>,
  reply: FastifyReply
) => {
  const toDelete = (request.body ?? { cnpj: '' }) as IEnterpriseRequest;

  const deleteEnterpriseImpl = new DeleteEnterpriseImpl();

  const deleteResult = await deleteEnterpriseImpl.execute({
    cnpj: toDelete.cnpj,
  });
  if (deleteResult.err) {
    return reply.status(HttpStatusCode.BadRequest).send(deleteResult.err);
  }

  return reply.status(HttpStatusCode.Created).send(deleteResult.enterprise);
};

export const listEnterprise = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const queryParams = request.query as { page: number };
  const page = queryParams.page ?? 1;
  if (page <= 0) {
    return reply
      .status(HttpStatusCode.BadRequest)
      .send(new Error('Minimum page number is 1'));
  }
  const listImpl = new ListEnterpriseImpl();
  const allEnterprises = listImpl.execute({ pageNumber: page });
  return reply.status(HttpStatusCode.OK).send(allEnterprises);
};

export const editEnterprise = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  console.log(request.query);
  return reply.status(HttpStatusCode.OK).send({});
};
