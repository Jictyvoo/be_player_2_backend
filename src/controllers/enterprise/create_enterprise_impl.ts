import { CnpjDTO } from '@providers/brasil_api/cnpj_interfaces';
import { dbConn } from '@init/database_client';
import { Enterprise, PhoneType } from '@prisma/client';

export class CreateEnterpriseImpl {
  private parsePhone(phone: string): { number: number; ddd?: number } {
    const parts = phone.split(' ');
    return {
      number: parseInt(parts[2].trim()),
      ddd: parseInt(parts[0].trim()),
    };
  }

  private async checkIfExists(cnpj: string): Promise<boolean> {
    // Checks if the enterprise already exists
    const isExistentEnterprise = await dbConn.enterprise.findFirst({
      where: {
        cnpj: cnpj,
      },
    });
    return !!isExistentEnterprise;
  }

  private allPhones(enterpriseData: CnpjDTO): {
    number: number;
    ddd: number;
    type: 'mobile';
  }[] {
    const firstPhone = this.parsePhone(enterpriseData.ddd_telefone_1);
    const phones = [
      {
        number: firstPhone.number,
        ddd: firstPhone.ddd,
        type: PhoneType.mobile,
      },
    ];

    if (enterpriseData.ddd_telefone_2) {
      const tempPhone = this.parsePhone(enterpriseData.ddd_telefone_2);
      phones.push({
        number: tempPhone.number,
        ddd: tempPhone.ddd,
        type: PhoneType.mobile,
      });
    }
    if (enterpriseData.ddd_fax) {
      const tempPhone = this.parsePhone(enterpriseData.ddd_fax);
      phones.push({
        number: tempPhone.number,
        ddd: tempPhone.ddd,
        type: PhoneType.mobile,
      });
    }
    return phones;
  }

  async execute(
    enterpriseData: CnpjDTO
  ): Promise<{ enterprise?: Enterprise; err?: Error }> {
    const isExistentEnterprise = await this.checkIfExists(enterpriseData.cnpj);

    if (isExistentEnterprise) {
      return {
        err: new Error('Enterprise cannot be created! CNPJ already registered'),
      };
    }

    const _district = await dbConn.district.create({
      data: {
        name: enterpriseData.bairro,
        city: {
          connectOrCreate: {
            create: {
              identifier: enterpriseData.codigo_municipio,
              name: enterpriseData.municipio,
              acronym: enterpriseData.uf,
            },
            where: {
              identifier: enterpriseData.codigo_municipio,
            },
          },
        },
      },
    });

    // Start the user creation
    const newEnterprise = await dbConn.enterprise.create({
      data: {
        cnpj: enterpriseData.cnpj,
        updatedAt: new Date(),
        createdAt: new Date(),
        activityStartDate: new Date(enterpriseData.data_inicio_atividade),
        corporateName: enterpriseData.razao_social,
        fantasyName: enterpriseData.nome_fantasia,
        shareCapital: enterpriseData.capital_social,
        qualificationOfTheResponsible:
          enterpriseData.qualificacao_do_responsavel,
        legalNatureCode: enterpriseData.codigo_natureza_juridica,
        outsideCityName: enterpriseData.nome_cidade_exterior,
        Size: {
          connectOrCreate: {
            create: {
              description: enterpriseData.descricao_porte,
              size: enterpriseData.porte,
            },
            where: {
              size: enterpriseData.porte,
            },
          },
        },
        Phones: {
          createMany: {
            data: this.allPhones(enterpriseData),
          },
        },
        Address: {
          create: {
            cep: {
              connectOrCreate: {
                create: {
                  cep: enterpriseData.cep.toString(),
                  route: enterpriseData.logradouro,
                  placeType: enterpriseData.descricao_tipo_logradouro,
                },
                where: {
                  cep: enterpriseData.cep.toString(),
                },
              },
            },
            district: {
              connect: {
                id: _district.id,
              },
            },
            number: enterpriseData.numero,
            complement: enterpriseData.complemento,
          },
        },
        BranchHeadOffice: {
          connectOrCreate: {
            create: {
              description: enterpriseData.descricao_matriz_filial,
              identifier: enterpriseData.identificador_matriz_filial,
            },
            where: {
              identifier: enterpriseData.identificador_matriz_filial,
            },
          },
        },
        Registration: {
          create: {
            date: new Date(enterpriseData.data_situacao_cadastral),
            reason: enterpriseData.motivo_situacao_cadastral,
            description: enterpriseData.descricao_situacao_cadastral,
            status: enterpriseData.situacao_cadastral,
          },
        },
      },
    });

    return { enterprise: newEnterprise };
  }
}
