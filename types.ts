export interface RevenueData {
  year: string;
  incomeTax: number;
  corporateTax: number;
  vat: number;
  customs: number;
  other: number;
  total: number;
}

export interface RegionalData {
  region: string;
  complianceRate: number;
  collection: number; // in Billions
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export enum AnalysisType {
  FORECAST = 'FORECAST',
  ANOMALY = 'ANOMALY',
  POLICY_IMPACT = 'POLICY_IMPACT'
}

export interface PolicyDocument {
  id: string;
  name: string;
  content: string;
  date: string;
}
