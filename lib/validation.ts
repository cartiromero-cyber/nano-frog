import type { AssessmentFields, InsuranceFields, BaseLeadFields } from "@/types";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /[0-9]{7,}/;

type Check = { valid: boolean; errors: Record<string, string> };

function base(data: Partial<BaseLeadFields>, errors: Record<string, string>) {
  if (!data.name || data.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!data.phone || !phoneRe.test(String(data.phone))) errors.phone = "Please enter a valid phone number.";
  if (!data.email || !emailRe.test(String(data.email))) errors.email = "Please enter a valid email address.";
}

// Change 002 (approved with modifications): required = name, phone, property address.
// Email is optional — validated only when provided.
export function validateAssessment(data: Partial<AssessmentFields>): Check {
  const errors: Record<string, string> = {};
  if (!data.name || data.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!data.phone || !phoneRe.test(String(data.phone))) errors.phone = "Please enter a valid phone number.";
  if (!data.address || data.address.trim().length < 5) errors.address = "Please enter the property address.";
  if (data.email && !emailRe.test(String(data.email))) errors.email = "Please enter a valid email address.";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateInsurance(data: Partial<InsuranceFields>): Check {
  const errors: Record<string, string> = {};
  base(data, errors);
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateContact(data: Partial<BaseLeadFields>): Check {
  const errors: Record<string, string> = {};
  base(data, errors);
  if (!data.message || data.message.trim().length < 2) errors.message = "Please add a short message.";
  return { valid: Object.keys(errors).length === 0, errors };
}
