import BaseApiService from "./baseApiService.js";

export class DepreciationService extends BaseApiService {
  async createDepreciation(depreciationData) {
    return await this.httpClient.post(
      `api/v1/admin/depreciations`,
      depreciationData
    );
  }
}

export default DepreciationService;