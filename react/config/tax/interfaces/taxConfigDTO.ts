export interface TaxDTO {
    id: number;
    name: string;
    document_type: string;
    document_number: string;
    email: string;
    address: string;
    phone: string;
    city_id: string;
    tax_charge_id: string | null;
    withholding_tax_id: string | null;
    koneksi_sponsor_slug: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}


export interface CreateTaxDTO {
    name: string;
    document_type: string;
    document_number: string;
    email: string;
    address: string;
    phone: string;
    city_id: string;
    tax_charge_id: string | null;
    withholding_tax_id: string | null;
    koneksi_sponsor_slug?: string | null;
}

export interface UpdateTaxDTO {
    name?: string;
    document_type?: string;
    document_number?: string;
    email?: string;
    address?: string;
    phone?: string;
    city_id?: string;
    tax_charge_id?: string | null;
    withholding_tax_id?: string | null;
    koneksi_sponsor_slug?: string | null;
}

