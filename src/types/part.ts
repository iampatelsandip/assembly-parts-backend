export enum PartType {
  RAW = 'RAW',
  ASSEMBLED = 'ASSEMBLED'
}

export interface ConstituentPart {
  id: string;
  quantity: number;
}

export interface PartBase {
  name: string;
  type: PartType;
  quantityInStock: number;
  parts?: ConstituentPart[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface for API responses (with string id)
export interface Part extends PartBase {
  id: string;
}

