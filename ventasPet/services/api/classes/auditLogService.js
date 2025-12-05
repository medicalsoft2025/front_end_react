import BaseApiService from "./baseApiService.js";

export class AuditLogService extends BaseApiService {

    constructor() {
        super("medical", "audit-logs");
    }

    async getPaginated({ per_page, page } = { per_page: 10, page: 1 }) {
        return await this.httpClient.get(
            `${this.microservice}/${this.endpoint}`,
            {
                per_page,
                page
            }
        );
    }
}

export default AuditLogService;