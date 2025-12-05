import { TaxDTO } from "./taxConfigDTO";

export type ToastSeverity =
    | "info"
    | "success"
    | "warn"
    | "error"
    | "secondary"
    | "contrast";

export interface TaxConfigTableProps {
    onEditItem?: (id: string) => void;
    taxes?: TaxDTO[];
    loading?: boolean;
    onDeleteItem?: (id: string) => void;
}

export interface Filtros {
    name: string;
    document_type: string | null;
    city_id: string;
}