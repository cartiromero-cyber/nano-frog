export type LeadType = "assessment" | "insurance-review" | "contact";

export interface BaseLeadFields {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  message?: string;
  // honeypot (must be empty for a real human)
  company?: string;
}

export interface AssessmentFields extends BaseLeadFields {
  roofAge?: string;
  roofType?: string;
  insuranceConcern?: boolean;
  visibleDamage?: boolean;
  photoUrl?: string;
}

export interface InsuranceFields extends BaseLeadFields {
  roofAge?: string;
  insurerName?: string;
  noticeReceived?: boolean;
}

export type LeadPayload = AssessmentFields | InsuranceFields | BaseLeadFields;

export interface Lead {
  id: string;
  type: LeadType;
  createdAt: string;
  data: LeadPayload;
}

export interface FormResult {
  ok: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
  id?: string;
}
