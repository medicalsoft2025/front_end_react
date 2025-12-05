import BaseApiService from "./baseApiService.js";

export class AccountingAccountsService extends BaseApiService {
    async getAllAccounts() {
        return await this.httpClient.get(`${this.microservice}/accounting-accounts`);
    }

    async getAccountById(accountId) {
        return await this.httpClient.get(
            `${this.microservice}/accounting-accounts/${accountId}`
        );
    }

    async createAccount(data) {
        return await this.httpClient.post(
            `${this.microservice}/accounting-accounts`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    async updateAccount(accountId, data) {
        return await this.httpClient.put(
            `${this.microservice}/accounting-accounts/${accountId}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    async deleteAccount(accountId) {
        return await this.httpClient.delete(
            `${this.microservice}/accounting-accounts/${accountId}`
        );
    }

    async getAccountByCode(accountCode) {
        return await this.httpClient.get(
            `${this.microservice}/accounting-accounts/code/${accountCode}`
        );
    }

    async getAccountingVouchers() {
        return await this.httpClient.get(
            `${this.microservice}/accounting-entries`
        );
    }
}

export default AccountingAccountsService;