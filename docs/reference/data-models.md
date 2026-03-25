# Data Models Reference

This document provides a technical description of the primary data structures used in the Radix Medical Dashboard.

## Core Entities

### Treatment

The central model that connects all other entities.

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `number` | Unique identifier. |
| `status` | `string` | Current status (e.g., 'ACTIVE', 'COMPLETED'). |
| `patient_id` | `number` | FK to `patient` table. |
| `facultatiu_id` | `number` | FK to `facultatiu` (doctor) table. |
| `rellotge_id` | `number` | FK to `dispositiu_rellotge` (watch) table. |
| `start_date` | `string` | ISO timestamp of treatment start. |
| `initial_radiation` | `number` | Initial dose of radioisotope administered. |

### Patient

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `number` | Unique identifier. |
| `name` | `string` | Full name of the patient. |
| `created_at` | `string` | Registration date. |

### Health Metrics

Recorded real-time data for a specific treatment.

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `number` | Unique identifier. |
| `treatment_id` | `number` | FK to the associated treatment. |
| `bpm` | `number` | Heart rate in beats per minute. |
| `steps` | `number` | Number of steps since last recording. |
| `current_radiation` | `number` | Measured radiation level for the patient. |
| `recorded_at` | `string` | ISO timestamp of the recording. |

## Enumerations and Constants

The project uses several string literals as enums for status and state:

- **Watch Status**: `EN_US` (In use), `DISPONIBLE` (Available), `MANTENIMENT` (Maintenance).
- **Treatment Status**: `ACTIVE`, `COMPLETED`, `CANCELLED`.

## TypeScript Types

All database types are automatically generated and available in `src/lib/types.ts`. You should use the `Database` type and its helper types (`Tables`, `TablesInsert`, `TablesUpdate`) to ensure type safety.
