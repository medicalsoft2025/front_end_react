export interface DepreciationFormInputs {
  assetId: string;
  date: Date;
  changeType: "depreciation" | "appreciation";
  previousValue: number;
  newValue: number;
  notes?: string;
}

export interface DepreciationAppreciationFormInputs {
  assetId: string;
  date: Date;
  changeType: "depreciation" | "appreciation";
  previousValue: number;
  newValue: number;
  notes?: string;
}