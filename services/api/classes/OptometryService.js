import BaseApiService from "./baseApiService.js";

export class OptometryService extends BaseApiService {
  async getAllOptometryRecipes() {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}?type=optometry`
    );
  }

  async getRecipeInvoiceStatus(recipeId) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/${recipeId}/invoice-status`
    );
  }

  // Puedes agregar más métodos según necesites, por ejemplo:
  async createOptometryRecipe(data, patientId) {
    return await this.httpClient.post(
      `${this.microservice}/${this.endpoint}`,
      { ...data, type: "optometry", patientId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async getOptometryRecipeById(id) {
    return await this.httpClient.get(
      `${this.microservice}/${this.endpoint}/${id}`
    );
  }
}

export default OptometryService;