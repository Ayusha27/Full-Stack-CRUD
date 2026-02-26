// src/types.ts
export interface Applicant {
  id?: number;
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
  quota_type: 'KCET' | 'COMEDK' | 'Management';
  total_seats: number;
  filled_seats: number;
  program?: Program; 
}



export interface Program {
  id: number;
  name: string;
  code: string;
  course_type: 'UG' | 'PG';
  institution_name: string;
  campus_name: string;
  total_intake: number;
}


export interface DashboardStats {
  intake_vs_admitted: {
    total: number;
    admitted: number;
  };
  remaining_seats: number;
  fee_pending_count: number;
}