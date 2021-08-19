import { CnpjDTO } from '@providers/brasil_api/cnpj_interfaces';
import { dbConn } from '@init/database_client';
import { Enterprise } from '@prisma/client';

export class CreateEnterpriseImpl {
  async execute(
    enterpriseData: CnpjDTO
  ): Promise<{ enterprise?: Enterprise; err?: Error }> {
    // Checks if the user already exists
    const isExistentEnterprise = await dbConn.enterprise.findFirst({
      where: {
        cnpj: enterpriseData.cnpj,
      },
    });

    if (isExistentEnterprise) {
      return {
        err: new Error('Enterprise cannot be created! CNPJ already registered'),
      };
    }

    // Start the user creation
    /*const newEnterprise = await dbConn.enterprise.create({
      data: {
        cnpj: enterpriseData.cnpj,
      },
    });

    return { enterprise: newEnterprise };*/
    return {};
  }
}
