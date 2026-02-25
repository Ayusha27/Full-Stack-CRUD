// src/types.ts
export interface Applicant {
  name: string;
  email: string;
  phone: string;
  category: string;
  entry_type: string;
  quota_type: string;
  program_id: number;
  gender: string;
  dob: string;
  address: string;
  marks_10th: number;
  marks_12th: number;
  parent_name: string;
  blood_group: string;
  document_status: string;
  fee_paid: boolean;
  admission_number?: string;
}

export interface SeatMatrix {
  id: number;
  program_id: number;
  quota_type: string;
  total_seats: number;
  filled_seats: number;
}