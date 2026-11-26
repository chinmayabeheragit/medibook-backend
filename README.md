# MediBook Core Service

MediBook Core Service is the backend for users, doctors, administrators, and appointments. It also exposes a prescription-image OCR endpoint that communicates with an external OCR service over gRPC.

## Implemented Features

### Users
- Register and log in
- View and update profiles
- Upload profile images to Cloudinary
- Book, view, and cancel appointments
- Scan prescriptions through the OCR service

### Doctors
- Log in
- View and update profiles
- Toggle availability
- View appointments
- Cancel or complete appointments
- View dashboard earnings and appointment statistics
- Browse public doctor listings

### Administrators
- Log in
- Add and list doctors
- Toggle doctor availability
- View and cancel appointments
- View dashboard statistics

### Appointment System
- Structured doctor slots by date and time
- Appointment confirmation and cancellation
- Completed, cancelled, and confirmed appointment states
- Idempotency-key support for duplicate booking requests
- Appointment booked/cancelled events published to RabbitMQ
- Redis caching for doctor profiles and lists

### OCR
- Accepts JPEG, PNG, or WebP prescription images
- Sends image bytes and MIME type to an OCR gRPC service
- Returns raw extracted text and detected medicines

### Additional Mongoose Models
The project also contains models for:
- Ambulance requests
- Hospital beds
- Blood donors
- Blood requests
- Lab tests

These models are currently infrastructure/data models only. They do not yet have implemented API routes or business services.

## Tech Stack

- Node.js 18+
- Express.js
- MongoDB and Mongoose
- Redis with ioredis
- RabbitMQ with amqplib
- Cloudinary
- gRPC
- JWT
- bcrypt
- Multer
- Helmet
- CORS
- Morgan
- Pino
- Jest and Supertest dependencies

## Project Structure

```text
medibook-backend/
├── config/
│   ├── cloudinary.js
│   ├── grpc.js
│   ├── mongodb.js
│   ├── rabbitmq.js
│   └── redis.js
├── constants/
├── controllers/
├── events/publishers/
├── middlewares/
├── models/
├── proto/
│   └── ocr.proto
├── repositories/
├── routes/
├── services/
├── src/
│   ├── app.js
│   └── server.js
├── utils/
├── package.json
└── README.md
```

## Installation

```bash
npm install
npm run dev
```

For a production start:

```bash
npm start
```

Create a local `.env` file and configure the variables listed below.

## Environment Variables

```env
PORT=5002
NODE_ENV=development
LOG_LEVEL=info

MONGODB_URI=mongodb://localhost:27017/medibook

JWT_SECRET=replace-with-a-long-random-secret

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-secure-password

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

RABBITMQ_URL=amqp://localhost

OCR_SERVICE_URL=localhost:50051

CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET_KEY=your-cloudinary-api-secret

ALLOWED_ORIGINS=http://localhost:3000
```

The server requires MongoDB. RabbitMQ, Redis, Cloudinary, and the OCR gRPC service must be available for their corresponding features.

## API Base URL

All routes are served below:

```text
/api
```

The health endpoint is available at:

```text
GET /health
```

## Authentication Headers

| Role | Header |
|---|---|
| User | `token: <JWT>` |
| Doctor | `dtoken: <JWT>` |
| Admin | `atoken: <JWT>` |

Appointment booking also accepts an optional `idempotency-key` header.

## API Endpoints

### Users

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/api/users/register` | Public | Register a user |
| POST | `/api/users/login` | Public | Log in a user |
| GET | `/api/users/profile` | User | Get the authenticated user's profile |
| PUT | `/api/users/profile` | User | Update profile; accepts an `image` multipart field |
| POST | `/api/users/appointments/book` | User | Book an appointment |
| GET | `/api/users/appointments` | User | List the user's appointments |
| PUT | `/api/users/appointments/:id/cancel` | User | Cancel an appointment |
| POST | `/api/users/scan-prescription` | User | Scan a prescription image |

The prescription endpoint accepts one multipart file field named `image`. JPEG, PNG, and WebP files are supported with a maximum size of 5 MB.

### Doctors

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/api/doctors/login` | Public | Log in a doctor |
| GET | `/api/doctors/list` | Public | List available doctors; optional `?speciality=Cardiologist` |
| GET | `/api/doctors/profile` | Doctor | Get the doctor's profile |
| PUT | `/api/doctors/profile` | Doctor | Update doctor profile settings |
| GET | `/api/doctors/appointments` | Doctor | List doctor appointments |
| PUT | `/api/doctors/appointments/:id/cancel` | Doctor | Cancel an appointment |
| PUT | `/api/doctors/appointments/:id/complete` | Doctor | Complete an appointment |
| GET | `/api/doctors/dashboard` | Doctor | Get doctor dashboard statistics |
| PUT | `/api/doctors/availability` | Doctor | Toggle doctor availability |

### Administrators

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/api/admin/login` | Public | Log in the administrator |
| POST | `/api/admin/doctors` | Admin | Add a doctor; accepts an `image` multipart field |
| GET | `/api/admin/doctors` | Admin | List doctors |
| PUT | `/api/admin/doctors/:id/availability` | Admin | Toggle doctor availability |
| GET | `/api/admin/appointments` | Admin | List appointments; optional `?status=pending` |
| PUT | `/api/admin/appointments/:id/cancel` | Admin | Cancel an appointment |
| GET | `/api/admin/dashboard` | Admin | Get dashboard statistics |

## Appointment Data

Appointments use the following statuses:

- `pending`
- `confirmed`
- `completed`
- `cancelled`

Payment states are represented by:

- `unpaid`
- `paid`
- `refunded`

## RabbitMQ Events

The `medibook` topic exchange publishes:

- `appointment.booked`
- `appointment.cancelled`

The application defines `appointment.completed`, but no current service path publishes that event yet.

## OCR gRPC Contract

The prescription endpoint calls `ocr.OcrService.ExtractText`.

Request:

```text
image: bytes
mime_type: string
```

Response:

```text
raw_text: string
medicines: repeated string
success: bool
error: string
```

## Current Development Status

- Core user, doctor, admin, and appointment flows are implemented.
- Redis caching is implemented with graceful cache-disable behavior on failure.
- RabbitMQ publishing is implemented with graceful event-publishing failure handling.
- Cloudinary uploads are implemented for profile and doctor images.
- Prescription OCR is implemented as a gRPC client.
- The ambulance, bed, blood donor/request, and lab test Mongoose models exist, but public APIs and services are not implemented.
- Automated tests are not yet present in the repository.

## License

MIT
