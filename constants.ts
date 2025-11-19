import { RevenueData, RegionalData } from './types';

export const REVENUE_HISTORY: RevenueData[] = [
  { year: '2019', incomeTax: 120, corporateTax: 95, vat: 150, customs: 40, other: 20, total: 425 },
  { year: '2020', incomeTax: 110, corporateTax: 80, vat: 135, customs: 30, other: 18, total: 373 },
  { year: '2021', incomeTax: 125, corporateTax: 100, vat: 160, customs: 45, other: 22, total: 452 },
  { year: '2022', incomeTax: 135, corporateTax: 115, vat: 180, customs: 50, other: 25, total: 505 },
  { year: '2023', incomeTax: 145, corporateTax: 125, vat: 200, customs: 55, other: 30, total: 555 },
  { year: '2024', incomeTax: 152, corporateTax: 130, vat: 215, customs: 58, other: 35, total: 590 },
];

export const REGIONAL_BREAKDOWN: RegionalData[] = [
  { region: 'Capital District', complianceRate: 92, collection: 250 },
  { region: 'North Industrial', complianceRate: 85, collection: 180 },
  { region: 'Southern Ports', complianceRate: 88, collection: 120 },
  { region: 'Western Agri', complianceRate: 74, collection: 40 },
];

export const SYSTEM_INSTRUCTION = `You are FiscusAI, a specialized economic assistant for the Ministry of Finance. 
Your role is to analyze fiscal data, explain tax revenue trends, and predict economic outcomes based on provided data.
You have access to data regarding Income Tax, Corporate Tax, VAT, Customs, and Other revenues.
When asked for forecasts, provide conservative, moderate, and optimistic scenarios.
Always maintain a professional, authoritative, yet accessible tone suitable for government ministers.
Do not invent data if not provided; explain that you are estimating based on general economic principles if data is missing.`;
