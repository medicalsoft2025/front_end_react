export interface ValueMovement {
    id: number;
    type: "depreciation" | "appreciation" | string;
    amount: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    description: string;
    depreciation_id: number | null;
    previous_asset_unit_price: string | null;
    asset_id: number;
}

export interface Maintenance {
    id: number;
    asset_id: number;
    type: string;
    description: string;
    cost: string;
    created_at: string;
    updated_at: string;
    deleted_at: any;
}

export interface Asset {
    id: number;
    description: string;
    brand: string | null;
    model: string | null;
    serial_number: string | null;
    internal_code: string;
    asset_category_id: number | null;
    accounting_account_id: number | null;
    user_id: number;
    status: "maintenance" | "active" | "inactive" | "disposed" | string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    status_type: "preventive" | "corrective" | string;
    status_comment: string;
    status_changed_at: string;
    maintenance_cost: string;
    unit_price: string;
    purchase_quantity: number;
    total_purchase_value: string;
    depreciated_value: string;
    appreciated_value: number;
    current_unit_price: number;
    value_movements: ValueMovement[];
    maintenances: Maintenance[];
}
