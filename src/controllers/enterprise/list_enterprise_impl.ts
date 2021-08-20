import { dbConn } from '@init/database_client';
import { Enterprise } from '@prisma/client';

export class ListEnterpriseImpl {
  async execute({
    pageNumber,
  }: {
    pageNumber: number;
  }): Promise<{ enterprises?: Enterprise[]; err?: Error }> {
    // Checks if the user already exists
    const allUndeleted = await dbConn.enterprise.findMany({
      where: {
        AND: {
          deletedAt: {
            equals: null,
          },
        },
      },
    });

    if (!allUndeleted || allUndeleted.length <= 0) {
      return {
        err: new Error('There is no enterprise to list!'),
      };
    }

    return { enterprises: allUndeleted };
  }
}
