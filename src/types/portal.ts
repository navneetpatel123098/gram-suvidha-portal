/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Citizen {
  name: string;
  phone: string;
  aadhaar: string;
  village: string;
  district: string;
  isLoggedIn: boolean;
}

export interface ServiceApplication {
  id: string;
  serviceId: string;
  serviceName: string;
  applicantName: string;
  applicantPhone: string;
  submissionDate: string;
  status: 'लंबित' | 'स्वीकृत' | 'अस्वीकृत' | 'जांच के अधीन'; // Pending, Approved, Rejected, Under Investigation
  details: Record<string, string>;
  receiptNo: string;
}

export interface CitizenComplaint {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  status: 'पंजीकृत' | 'कार्य प्रगति पर' | 'समाधानित'; // Registered, In Progress, Resolved
  remarks?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  hindiName: string;
  category: 'कृषि' | 'परिवहन' | 'कल्याण' | 'नागरिक'; // Agriculture, Transport, Welfare, Citizen Services
  description: string;
  iconName: string;
  borderColor: string;
  accentColor: string;
  tagColor: string;
  bgIconColor: string;
  externalUrl?: string;
}

export interface CropRegistration {
  farmerName: string;
  aadhaar: string;
  cropType: string;
  areaAcre: number;
  expectedYieldQuintal: number;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  village: string;
}

export interface PMKisanStatus {
  farmerName: string;
  aadhaar: string;
  installmentsPaid: number;
  lastPaymentDate: string;
  status: 'सक्रिय' | 'अपात्र' | 'सत्यापन लंबित';
  bankAccount: string;
}

export interface VehicleRC {
  vehicleNo: string;
  ownerName: string;
  makerModel: string;
  regDate: string;
  fuelType: string;
  engineNo: string;
  chassisNo: string;
  insuranceValidTill: string;
  fitnessValidTill: string;
  pucValidTill: string;
}

export interface TrafficChallan {
  challanId: string;
  vehicleNo: string;
  violation: string;
  amount: number;
  date: string;
  location: string;
  status: 'लंबित' | 'भुगतान किया गया';
}
