const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth?: string;
  address?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorProfile {
  id: string;
  specialization: string;
  qualifications: string;
  experience: number;
  consultationFee: number;
  bio?: string;
  licenseNumber: string;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  symptoms?: string;
  notes?: string;
  cancellationReason?: string;
  patientId: string;
  patient?: User;
  doctorId: string;
  doctor?: DoctorProfile;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  doctorId: string;
  doctor?: DoctorProfile;
  createdAt: string;
  updatedAt: string;
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API Error: ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Handle 204 No Content (empty response) - common for DELETE requests
    if (response.status === 204) {
      return undefined as T;
    }

    // Get response text to check if it's empty
    const text = await response.text();
    
    // If response is empty, return undefined
    if (!text || text.trim() === '') {
      return undefined as T;
    }

    // Try to parse as JSON
    try {
      return JSON.parse(text);
    } catch {
      // If not JSON, return as text
      return text as T;
    }
  } catch (error: any) {
    // More specific error handling
    if (error instanceof TypeError) {
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        throw new Error(`Network error: Cannot connect to ${API_BASE_URL}. Please ensure the backend is running on port 3000 and CORS is enabled.`);
      }
    }
    throw error;
  }
}

// Auth API
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth?: string;
  address?: string;
}

export const authAPI = {
  login: (credentials: LoginCredentials) => fetchAPI<User>('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  signup: (data: SignupData) => fetchAPI<User>('/users/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Users API
export const usersAPI = {
  getAll: () => fetchAPI<User[]>('/users'),
  getById: (id: string) => fetchAPI<User>(`/users/${id}`),
  create: (data: Partial<User>) => fetchAPI<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<User>) => fetchAPI<User>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI<void>(`/users/${id}`, {
    method: 'DELETE',
  }),
};

// Appointments API
export const appointmentsAPI = {
  getAll: () => fetchAPI<Appointment[]>('/appointments'),
  getById: (id: string) => fetchAPI<Appointment>(`/appointments/${id}`),
  getByPatient: (patientId: string) => fetchAPI<Appointment[]>(`/appointments/patient/${patientId}`),
  getByDoctor: (doctorId: string) => fetchAPI<Appointment[]>(`/appointments/doctor/${doctorId}`),
  create: (data: Partial<Appointment>) => fetchAPI<Appointment>('/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<Appointment>) => fetchAPI<Appointment>(`/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  cancel: (id: string, cancellationReason?: string) => fetchAPI<Appointment>(`/appointments/${id}/cancel`, {
    method: 'PUT',
    body: JSON.stringify({ cancellationReason }),
  }),
  delete: (id: string) => fetchAPI<void>(`/appointments/${id}`, {
    method: 'DELETE',
  }),
};

// Doctor Profiles API
export const doctorProfilesAPI = {
  getAll: () => fetchAPI<DoctorProfile[]>('/doctor-profiles'),
  getById: (id: string) => fetchAPI<DoctorProfile>(`/doctor-profiles/${id}`),
  getByUserId: (userId: string) => fetchAPI<DoctorProfile | null>(`/doctor-profiles/user/${userId}`).catch(() => null),
  create: (data: Partial<DoctorProfile>) => fetchAPI<DoctorProfile>('/doctor-profiles', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<DoctorProfile>) => fetchAPI<DoctorProfile>(`/doctor-profiles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI<void>(`/doctor-profiles/${id}`, {
    method: 'DELETE',
  }),
};

// Time Slots API
export const timeSlotsAPI = {
  getAll: () => fetchAPI<TimeSlot[]>('/time-slots'),
  getById: (id: string) => fetchAPI<TimeSlot>(`/time-slots/${id}`),
  getByDoctor: (doctorId: string) => fetchAPI<TimeSlot[]>(`/time-slots/doctor/${doctorId}`),
  create: (data: Partial<TimeSlot>) => fetchAPI<TimeSlot>('/time-slots', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<TimeSlot>) => fetchAPI<TimeSlot>(`/time-slots/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI<void>(`/time-slots/${id}`, {
    method: 'DELETE',
  }),
};

