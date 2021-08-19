import { RouteGenericInterface } from 'fastify/types/route';

export interface IEnterpriseRequest extends RouteGenericInterface {
  cnpj: string;
  branch_head_office?: any;
  corporate_name?: string;
  fantasy_name?: string;
  registration?: any;
  outside_city_name?: string;
  legal_nature_code?: number;
  activity_start_date?: Date;
  address?: any;
  size?: any;
  qualification_of_the_responsible?: number;
  share_capital?: number;
  Phones?: any[];
  Cnae?: any[];
  NationalSimple?: any[];
  Mei?: any[];
}
