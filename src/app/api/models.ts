export interface CustomerResponse {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  createdAt: string;
  appointment?: AppointmentSummary | null;
}

export interface CustomerCreateRequest {
  name: string;
  phone?: string | null;
  email?: string | null;
  appointment?: AppointmentUpsertRequest | null;
}

export type CustomerUpdateRequest = CustomerCreateRequest;

export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'NO_SHOW';

export interface AppointmentSummary {
  id: string;
  startsAt: string;
  status: AppointmentStatus;
  notes?: string | null;
}

export interface AppointmentUpsertRequest {
  startsAt: string;
  status?: AppointmentStatus | null;
  notes?: string | null;
}
