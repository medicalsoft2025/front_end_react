import BaseApiService from "./baseApiService.js";
import { cleanJsonObject } from "../../utilidades.js";

export class AssetsService extends BaseApiService {

    async getAll(data) {
        return await this.httpClient.get(`${this.microservice}${this.version}/${this.endpoint}/query`, cleanJsonObject(data));
    }

    async updateAssetStatus(assetId, body) {
      console.log(`Updating asset status:`, assetId, body);
      try {
        const url = `api/v1/admin/assets/${assetId}/status`;
        return await this.httpClient.patch(url, body );
      } catch (error) {
        console.error(
          `Error updating ${error.response?.data?.message} for asset ${assetId}:`,
          error
        );
        throw error;
      }
    }

    async getAssetsWithValueMovementHistory({ createdAt, type, per_page = 10, page = 1, search = ""}) {
      try {
        const dateRange = createdAt?.split(',');
        const valueMovementConditions = `[type:${type || null};created_at:>=${dateRange?.[0] || null};created_at:<=${dateRange?.[1] || null}]`

        const response = await this.httpClient.get(`${this.microservice}${this.version}/${this.endpoint}/query`, {
          per_page,
          page, 
          search,
          hasValueMovements: valueMovementConditions,
          include: `valueMovements${valueMovementConditions}`
        });
        return response.data;
      } catch (error) {
        console.error(`Error fetching assets with value movement history:`, error);
        throw error;
      }
    }

    async getAssetsWithMaintenanceHistory({ createdAt, type, per_page = 10, page = 1, search = ""}) {
      try {
        const dateRange = createdAt?.split(',');
        const maintenancesConditions = `[type:${type || null};created_at:>=${dateRange?.[0] || null};created_at:<=${dateRange?.[1] || null}]`

        const response = await this.httpClient.get(`${this.microservice}${this.version}/${this.endpoint}/query`, {
          per_page,
          page, 
          search,
          hasMaintenances: maintenancesConditions,
          include: `maintenances${maintenancesConditions}`
        });
        return response.data;
      } catch (error) {
        console.error(`Error fetching assets with value movement history:`, error);
        throw error;
      }
    }
}

export default AssetsService;
