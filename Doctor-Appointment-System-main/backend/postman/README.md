# Postman Collection for Doctor Appointment System

This folder contains the Postman collection for testing the Doctor Appointment System API.

## Import Instructions

1. Open Postman
2. Click **Import** button (top left)
3. Select **File** tab
4. Choose `Doctor Appointment System.postman_collection.json`
5. Click **Import**

## Environment Setup

The collection uses a variable `base_url` which defaults to `http://localhost:3000`.

### To set up a custom environment:

1. In Postman, click **Environments** (left sidebar)
2. Click **+** to create a new environment
3. Add variable:
   - **Variable**: `base_url`
   - **Initial Value**: `http://localhost:3000` (or your server URL)
   - **Current Value**: `http://localhost:3000`
4. Save and select the environment

## API Endpoints Overview

### Users (`/users`)
- `POST /users` - Create Patient (dedicated request for creating patients)
- `POST /users` - Create Doctor User (dedicated request for creating doctor users)
- `POST /users` - Create User (generic request)
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Doctor Profiles (`/doctor-profiles`)
- `POST /doctor-profiles` - Create doctor profile
- `GET /doctor-profiles` - Get all doctor profiles
- `GET /doctor-profiles/:id` - Get doctor profile by ID
- `GET /doctor-profiles/user/:userId` - Get doctor profile by user ID
- `PATCH /doctor-profiles/:id` - Update doctor profile
- `DELETE /doctor-profiles/:id` - Delete doctor profile

### Time Slots (`/time-slots`)
- `POST /time-slots` - Create time slot
- `GET /time-slots` - Get all time slots
- `GET /time-slots/:id` - Get time slot by ID
- `GET /time-slots/doctor/:doctorId` - Get time slots by doctor ID
- `PATCH /time-slots/:id` - Update time slot
- `DELETE /time-slots/:id` - Delete time slot

### Appointments (`/appointments`)
- `POST /appointments` - Create appointment
- `GET /appointments` - Get all appointments
- `GET /appointments/:id` - Get appointment by ID
- `GET /appointments/patient/:patientId` - Get appointments by patient ID
- `GET /appointments/doctor/:doctorId` - Get appointments by doctor ID
- `PATCH /appointments/:id` - Update appointment
- `PUT /appointments/:id/cancel` - Cancel appointment
- `DELETE /appointments/:id` - Delete appointment

## Testing Workflow

### 1. Create a Patient
1. Use **Users > Create Patient**
2. The request body is pre-filled with `"role": "PATIENT"`
3. **Copy the `id` from the response** - you'll need it as `patientId` for appointments

### 2. Create a Doctor User
1. Use **Users > Create Doctor User**
2. The request body is pre-filled with `"role": "DOCTOR"`
3. **Copy the `id` from the response** - you'll need it as `userId` for the doctor profile

### 3. Create Doctor Profile
1. Use **Doctor Profiles > Create Doctor Profile**
2. Replace `"userId"` with the doctor user ID from step 2
3. **Copy the `id` from the response** - you'll need it as `doctorId` for appointments (NOT the doctor user ID!)

### 4. Create Time Slots
1. Use **Time Slots > Create Time Slot**
2. Use the doctor profile ID from step 3
3. Set `dayOfWeek` to one of: `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY`

### 4. Create Appointment
1. Use **Appointments > Create Appointment**
2. Replace `"patientId"` with the patient ID from step 1
3. Replace `"doctorId"` with the doctor profile ID from step 3 (NOT the doctor user ID!)
4. Set `appointmentDate` in ISO format (e.g., `2025-12-20T10:00:00Z`)
5. Set `status` to one of: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`

**Important:** Use the **Doctor Profile ID** (from step 3), not the Doctor User ID (from step 2) for the `doctorId` field!

## Example Request Bodies

### Create Patient
**Use the "Create Patient" request in Postman**
```json
{
  "email": "patient@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "address": "123 Main St, City, Country",
  "role": "PATIENT"
}
```
**Response:** Copy the `id` field → use as `patientId` in appointments

### Create Doctor User
**Use the "Create Doctor User" request in Postman**
```json
{
  "email": "doctor@example.com",
  "password": "password123",
  "fullName": "Dr. Jane Smith",
  "phoneNumber": "+1234567891",
  "dateOfBirth": "1985-05-20",
  "address": "456 Medical Center, City, Country",
  "role": "DOCTOR"
}
```
**Response:** Copy the `id` field → use as `userId` in doctor profile

### Create Doctor Profile
```json
{
  "specialization": "Cardiology",
  "qualifications": "MD, PhD in Cardiology",
  "experience": 10,
  "consultationFee": 150.00,
  "bio": "Experienced cardiologist with 10 years of practice",
  "licenseNumber": "LIC-12345",
  "userId": "user-id-from-step-2"
}
```

### Create Time Slot
```json
{
  "dayOfWeek": "MONDAY",
  "startTime": "09:00",
  "endTime": "17:00",
  "isAvailable": true,
  "doctorId": "doctor-profile-id-from-step-3"
}
```

### Create Appointment
```json
{
  "appointmentDate": "2025-12-20T10:00:00Z",
  "startTime": "10:00",
  "endTime": "11:00",
  "status": "PENDING",
  "symptoms": "Chest pain and shortness of breath",
  "notes": "Patient needs urgent consultation",
  "patientId": "patient-user-id-from-step-1",
  "doctorId": "doctor-profile-id-from-step-3"
}
```

## Notes

- Replace placeholder IDs (`user-id-here`, `doctor-profile-id-here`, etc.) with actual IDs from previous requests
- All dates should be in ISO 8601 format
- `dayOfWeek` enum values: `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY`
- `status` enum values: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`
- `role` enum values: `PATIENT`, `DOCTOR`, `ADMIN`

