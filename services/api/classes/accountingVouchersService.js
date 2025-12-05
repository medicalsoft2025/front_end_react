import BaseApiService from "./baseApiService.js";

export class AccountingVouchersService extends BaseApiService {
  async getAccountingVouchers(paramsPaginator) {
    const params = new URLSearchParams();
    if (paramsPaginator.fecha_inicio) params.append('startDate', paramsPaginator.fecha_inicio);
    if (paramsPaginator.fecha_fin) params.append('endDate', paramsPaginator.fecha_fin);
    if (paramsPaginator.numero_comprobante) params.append('seatNumber', paramsPaginator.numero_comprobante);
    if (paramsPaginator.codigo_contable) params.append('accountCode', paramsPaginator.codigo_contable);
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}?withDetails=true&page=${paramsPaginator.page}&perPage=${paramsPaginator.per_page}&${params}`
    );
  }

  async getLastRow() {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/last-row`
    );
  }

  async storeAccountingVouchers(data) {
    return await this.httpClient.post(
      `${this.microservice}/${this.endpoint}`,
      data
    );
  }

  async updateAccountingVouchers(id, data) {
    return await this.httpClient.put(
      `${this.microservice}/${this.endpoint}/${id}`,
      data
    );
  }

  async delete(id) {
    return await this.httpClient.delete(
      `${this.microservice}/${this.endpoint}/${id}/mark-delete`
    );
  }
}

export default AccountingVouchersService;
