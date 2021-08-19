import axios from 'axios';
import { CnpjDTO } from './cnpj_interfaces';
export class LoadBrasilApiEnterprise {
  static apiUri = Object.freeze({
    domain: 'https://brasilapi.com.br',
    path: '/api/cnpj/v1',
  });

  buildUrl(cnpj: string): string {
    const apiParts = LoadBrasilApiEnterprise.apiUri;
    return `${apiParts.domain}${apiParts.path}/${cnpj}`;
  }

  async fetchEnterprise(cnpj: string): Promise<CnpjDTO> {
    const response = await axios.get(this.buildUrl(cnpj), {});
    if (response.status != 200) {
      return null;
    }
    return response.data as CnpjDTO;
  }
}
