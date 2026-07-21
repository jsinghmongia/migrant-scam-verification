export interface Agent {
  id: string;
  name: string;
  licenseNumber: string;
  agencyName: string;
  status: 'CERTIFIED' | 'REVOKED' | 'SUSPENDED' | 'NOT_FOUND';
  certifiedSince?: string;
  validUntil?: string;
  countryScope?: string[];
  contactEmail?: string;
  contactPhone?: string;
  officeAddress?: string;
  rating?: number;
  remarks?: string;
}

export interface ScamReport {
  id: string;
  reportedAt: string;
  scamType: 'whatsapp_msg' | 'facebook_ad' | 'job_offer' | 'unlicensed_agent' | 'upfront_fee' | 'other';
  title: string;
  description: string;
  agentName?: string;
  phoneNumber?: string;
  upiId?: string;
  bankAccount?: string;
  countryTargeted: string;
  evidenceText?: string;
  verifiedCount: number;
}

export interface AnalysisResult {
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  explanation: string;
  redFlags: string[];
  actionSteps: string[];
  scamPatternsDetected: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  analysis?: AnalysisResult;
}
