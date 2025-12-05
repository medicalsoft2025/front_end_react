import BaseApiService from "./baseApiService.js";

export class CupsService extends BaseApiService {
  async getCupsAll() {
    return await this.httpClient.get(`${this.microservice}/${this.endpoint}`);
  }

  async getCupsByCode(code) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/get-by-code/${code}`
    );
  }
}

export default CupsService;
