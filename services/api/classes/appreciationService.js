import BaseApiService from "./baseApiService.js";

export class AppreciationService extends BaseApiService {
  async createAppreciation(appreciationData) {
    return await this.httpClient.post(
      `api/v1/admin/appreciations`,
      appreciationData
    );
  }
}

export default AppreciationService;