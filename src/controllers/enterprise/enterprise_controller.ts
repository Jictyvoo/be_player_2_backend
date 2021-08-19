import { FastifyRequest, FastifyReply } from 'fastify';
import { IEnterpriseRequest } from '@entities/enterprise';
import { DeleteEnterpriseImpl } from './delete_enterprise_impl';
import { ListEnterpriseImpl } from './list_enterprise_impl';
import { HttpStatusCode } from '@util/status_codes';
import { LoadBrasilApiEnterprise } from '@providers/brasil_api/load_enterprise_brasilapi';
import { CreateEnterpriseImpl } from './create_enterprise_impl';
export const createEnterprise = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const enterpriseData = request.body as IEnterpriseRequest;
  const cnpj = enterpriseData.cnpj;
  if (!cnpj || cnpj.length < 14) {
    return reply
      .status(HttpStatusCode.BadRequest)
      .send(new Error('CNPJ field is missing from request'));
  }
  const apiLoadProvider = new LoadBrasilApiEnterprise();
  const dataFetched = await apiLoadProvider.fetchEnterprise(cnpj);
  if (!dataFetched) {
    return reply
      .status(HttpStatusCode.BadRequest)
      .send(new Error('CNPJ invalid or not found!'));
  }
  const createImpl = new CreateEnterpriseImpl();

  const creationResult = await createImpl.execute(dataFetched);
  if (creationResult.err) {
    return reply.status(HttpStatusCode.Conflict).send(creationResult.err);
  }
  return reply.status(HttpStatusCode.OK).send(dataFetched);
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
