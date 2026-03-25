# API and Services Reference

This document covers the helper functions and services located in the `src/lib` directory.

## 1. Authentication Services (`src/lib/auth.ts`)

These functions handle user sessions and identity.

- **`signIn(client, email, password)`**: Authenticates a user with Supabase.
- **`signOut(client)`**: Ends the current session.
- **`getUser(client)`**: Returns the currently authenticated Supabase user.
- **`getFacultatuiByEmail(client, email)`**: Retrieves the doctor's record associated with an email.

## 2. Database Queries (`src/lib/queries.ts`)

All database interactions are centralized here for better maintainability.

### Treatment Queries
- **`getActiveTreatments(client)`**: Returns all treatments with status 'ACTIVE', including details (patient, watch, etc.).
- **`getTreatmentById(client, id)`**: Fetches a single treatment by ID with its relations.
- **`createTreatment(client, treatmentData)`**: Inserts a new treatment and marks the associated watch as 'EN_US'.

### Patient Queries
- **`getPatients(client)`**: Fetches all patient records.
- **`createPatient(client, patientData)`**: Registers a new patient.

### Alerts and Metrics
- **`getUnresolvedAlerts(client)`**: Fetches all unresolved medical alerts.
- **`resolveAlert(client, alertId)`**: Marks an alert as resolved.
- **`getHealthMetrics(client, treatmentId, limit)`**: Fetches history of health metrics for a treatment.

## 3. Realtime Services (`src/lib/realtime.ts`)

Dedicated to handling live updates.

- **`subscribeToHealthMetrics(client, treatmentId, callback)`**: Sets up a Supabase Realtime subscription for a specific treatment.

## 4. Utility Functions (`src/lib/utils.ts`)

General helper functions used across the project.

- **`formatDate(isoString)`**: Formats an ISO string into a human-readable format.
- **`cn(...inputs)`**: A standard utility for merging Tailwind CSS classes conditionally.
