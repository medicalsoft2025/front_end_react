import BaseApiService from "./baseApiService.js";

export class FarmaciaService extends BaseApiService {
  async getAllRecipes(status = "ALL", search = "") {
    const params = new URLSearchParams();
    params.append('status', status);
    if (search) {
      params.append('search', search);
    }
    return await this.httpClient.get(`${this.microservice}/recipes?${params.toString()}`);
  }
  async getAllprescriptions() {
    return await this.httpClient.get(`${this.microservice}/prescriptions`);
  }
  async getRecipesById(id) {
    return await this.httpClient.get(`${this.microservice}/recipes/${id}`);
  }
  async getPrescriptionsByid(id) {
    return await this.httpClient.get(
      `${this.microservice}/prescriptions/${id}`
    );
  }
  async getAllVacunas() {
    return await this.httpClient.get(`api/v1/admin/products/vacunas`);
  }

  async validateMedicine(id) {
    return await this.httpClient.get(`${this.microservice}/medicines/${id}`);
  }

  async verifyProductsBulk(products) {
    return await this.httpClient.post(`api/v1/admin/products/check/verify-product-bulk`, products);
  }

  async getProductsWithAvailableStock(productTypeNames, inventoryType) {
    return await this.httpClient.get(`api/v1/admin/products/with/available-stock/${productTypeNames}/${inventoryType}`);
  }

  async completeDelivery(products) {
    return await this.httpClient.post(`api/v1/admin/pharmacy/sell`, products);
  }

  async changeStatus(status, recipe_id) {
    return await this.httpClient.post(`medical/recipes/${recipe_id}/update-status`, { status });
  }

  async getBillingByType(type) {
    return await this.httpClient.get(`medical/companies/1/billings/by-type/${type}`);
  }

  async createInvoice(invoicePayload) {
    return await this.httpClient.post(`api/v1/admin/invoices/sales`, invoicePayload);
  }
}

export default FarmaciaService;
