import { dbConn } from '@init/database_client';
import { Enterprise } from '@prisma/client';
import { IEnterpriseRequest } from '@entities/enterprise';

export class DeleteEnterpriseImpl {
  async execute({
    cnpj,
  }: IEnterpriseRequest): Promise<{ enterprise?: Enterprise; err?: Error }> {
    // Checks if the user already exists
    const existentEnterprise = await dbConn.enterprise.findFirst({
      where: {
        cnpj: cnpj,
      },
    });

    if (!existentEnterprise) {
      return {
        err: new Error('Cannot find enterprise with the provided CNPJ!'),
      };
    }

    // Start the user creation
    const deletedEnterprise = await dbConn.enterprise.delete({
      where: {
        cnpj: cnpj,
      },
    });

    return { enterprise: deletedEnterprise };
  }
}
