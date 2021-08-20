import { FastifyRequest, FastifyReply } from 'fastify';
import { IEnterpriseRequest } from '@entities/enterprise';
import { DeleteEnterpriseImpl } from './delete_enterprise_impl';
import { ListEnterpriseImpl } from './list_enterprise_impl';
import { HttpStatusCode } from '@util/status_codes';
import { LoadBrasilApiEnterprise } from '@providers/brasil_api/load_enterprise_brasilapi';
import { CreateEnterpriseImpl } from './create_enterprise_impl';
import { Enterprise } from '@prisma/client';

function jsonifyEnterprise(enterprise: Enterprise) {
  return {
    cnpj: enterprise.cnpj,
    'fantasy-name': enterprise.fantasyName,
    name: enterprise.corporateName,
    'share-capital': enterprise.shareCapital.toString(),
    'activity-start-date': enterprise.activityStartDate,
  };
}

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
  return reply
    .status(HttpStatusCode.Created)
    .send(jsonifyEnterprise(creationResult.enterprise));
};

export const deleteEnterprise = async (
  request: FastifyRequest<IEnterpriseRequest>,
  reply: FastifyReply
) => {
  const toDelete = (request.body ?? { cnpj: '' }) as IEnterpriseRequest;
  if (toDelete.cnpj?.length <= 0) {
    return reply
      .status(HttpStatusCode.BadRequest)
      .send(new Error('A CNPJ is needed to delete the enterprise'));
  }

  const deleteEnterpriseImpl = new DeleteEnterpriseImpl();

  const deleteResult = await deleteEnterpriseImpl.execute({
    cnpj: toDelete.cnpj,
  });
  if (deleteResult.err) {
    return reply.status(HttpStatusCode.BadRequest).send(deleteResult.err);
  }

  return reply
    .status(HttpStatusCode.Accepted)
    .send(jsonifyEnterprise(deleteResult.enterprise));
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
  const listResult = await listImpl.execute({ pageNumber: page });
  if (listResult.err) {
    return reply.status(HttpStatusCode.NoContent).send(listResult.err);
  }
  return reply.status(HttpStatusCode.OK).send(
    listResult.enterprises.map((value) => {
      return jsonifyEnterprise(value);
    })
  );
};

export const editEnterprise = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  console.log(request.query);
  return reply.status(HttpStatusCode.OK).send({});
};
