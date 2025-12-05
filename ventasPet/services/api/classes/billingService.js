import BaseApiService from "./baseApiService.js";

export class BillingService extends BaseApiService {
  async getBillingReport(data) {
    return await this.httpClient.post(
      `medical/admissions/billing/report`,
      data
    );
  }

  async getBillingReportByEntity(data) {
    return await this.httpClient.post(
      `medical/admissions/billing/report/by-entity`,
      data
    );
  }

  async storeByEntity(data) {
    return await this.httpClient.post(
      `medical/admissions/billing/store-by-entity`,
      data
    );
  }
}

export default BillingService;
