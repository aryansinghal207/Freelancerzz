# Dual Role System - Implementation Guide

## Overview

The FreeLancer application now supports two user roles:
1. **Freelancer** - Full access to manage clients, projects, tasks, time tracking, invoices, and reports
2. **Client** - Limited access to view their projects, track progress, see work sessions, and view invoices

## Database Changes

### User Model Updates
```javascript
{
  name: String,
  email: String,
  passwordHash: String,
  role: String, // 'freelancer' or 'client'
  clientId: ObjectId // Reference to Client model (for client role users)
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register as freelancer (default)
- `POST /api/auth/login` - Login (works for both roles)
- `POST /api/auth/invite-client` - (Freelancer only) Invite client to portal
- `POST /api/auth/register-client` - Client self-registration with clientId

### Client Portal (Client role only)
- `GET /api/client-portal/dashboard` - Dashboard summary
- `GET /api/client-portal/info` - Client information
- `GET /api/client-portal/projects` - List all projects
- `GET /api/client-portal/projects/:id` - Get project details
- `GET /api/client-portal/projects/:projectId/tasks` - Get project tasks
- `GET /api/client-portal/work-sessions` - Get work sessions (filterable)
- `GET /api/client-portal/invoices` - List invoices
- `GET /api/client-portal/invoices/:id` - Get invoice details
- `GET /api/client-portal/time-report` - Time tracking report

### Freelancer Routes (Freelancer role only)
All existing routes remain the same:
- `/api/clients` - Client management
- `/api/projects` - Project management
- `/api/tasks` - Task management
- `/api/work` - Time tracking
- `/api/invoices` - Invoice management
- `/api/reports` - Reports
- `/api/calendar` - Calendar views

## Frontend Routes

### Freelancer Routes
- `/clients` - Manage clients (includes "Invite to Portal" button)
- `/projects` - Manage projects
- `/tasks` - Manage tasks
- `/timer` - Time tracking
- `/invoices` - Invoice management
- `/reports` - Reports
- `/calendar` - Calendar view

### Client Portal Routes
- `/client/dashboard` - Dashboard overview
- `/client/projects` - View projects
- `/client/projects/:id` - Project details with tasks and work sessions
- `/client/invoices` - View invoices
- `/client/time-report` - Time tracking report

## How to Use

### For Freelancers

1. **Register/Login as Freelancer**
   - Default registration creates a freelancer account
   - Login with email and password

2. **Invite a Client to Portal**
   - Go to Clients page
   - Click "Invite to Portal" button next to a client
   - Enter client's email and name
   - System generates temporary password
   - Share credentials with client securely

3. **Manage Projects**
   - Projects automatically link to clients
   - Clients can view their projects in their portal

### For Clients

1. **Receive Invitation**
   - Freelancer sends email and temporary password
   - Login at the same URL

2. **Access Client Portal**
   - Dashboard shows project summary, tasks, hours, invoices
   - View all projects assigned by freelancer
   - See detailed work sessions and time logs
   - Download invoice PDFs
   - Track project progress

## Security Features

- **Role-based middleware**: Routes protected by role checks
- **JWT authentication**: Token-based authentication for both roles
- **Data isolation**: Clients only see their own data
- **Freelancer ownership**: All data validated against freelancer's userId

## Migration Notes

### For Existing Installations

1. **Existing users**: All existing users default to 'freelancer' role
2. **No breaking changes**: Existing freelancer functionality unchanged
3. **Database migration**: Run the app - schema will auto-update via Mongoose

### Database Update
No manual migration needed. When you start the server, Mongoose will handle the schema updates automatically. Existing users will have `role: 'freelancer'` by default.

## Environment Variables

No additional environment variables needed. Uses existing configuration:
- `JWT_SECRET` - For token generation
- `MONGO_URI` - Database connection
- `CLIENT_ORIGIN` - CORS configuration

## Testing the Implementation

### Test Freelancer Flow
1. Register as freelancer: `POST /api/auth/register`
2. Create a client: `POST /api/clients`
3. Invite client to portal: `POST /api/auth/invite-client`
4. Create projects for the client

### Test Client Flow
1. Login with client credentials
2. Access `/client/dashboard`
3. View projects, invoices, and time reports
4. Verify data isolation (only see own client's data)

## Common Issues

### Client Can't Login
- Verify client was invited via `/api/auth/invite-client`
- Check that clientId is properly linked to User record

### Client Sees No Data
- Ensure projects are assigned to the correct clientId
- Verify work sessions reference the correct projectId

### Freelancer Sees Client Routes
- Navigation is role-based; freelancers won't see client menu items
- Routes are protected and will redirect if wrong role

## Future Enhancements

Potential additions:
- Email notifications for client invitations
- Password reset functionality
- Client ability to comment on projects/tasks
- File uploads for project documents
- Client approval workflow for invoices
- Multi-language support
- Custom branding per client

## API Response Examples

### Login Response (with role)
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client",
    "clientId": "507f1f77bcf86cd799439012"
  }
}
```

### Client Dashboard Response
```json
{
  "totalProjects": 3,
  "activeProjects": 2,
  "totalTasks": 15,
  "completedTasks": 10,
  "totalHours": 45.5,
  "totalInvoiced": 50000,
  "pendingAmount": 15000,
  "recentProjects": [...],
  "recentInvoices": [...]
}
```
