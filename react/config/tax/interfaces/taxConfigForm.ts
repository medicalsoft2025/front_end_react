
import { TaxDTO } from "./taxConfigDTO";

export interface TaxFormInputs {
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

export interface TaxFormProps {
    formId: string;
    onSubmit: (data: TaxFormInputs) => void;
    initialData?: TaxDTO;
    onCancel?: () => void;
    loading?: boolean;
}