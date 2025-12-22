# 🗄️ Database Schema - Updated Structure

## ✅ Database Cleaned Successfully!

All existing data has been removed. You can now start fresh with the updated schema.

---

## Current Database Models

### 1. **User Model** (Authentication & Roles)
```javascript
{
  name: String (required),
  email: String (required, unique, indexed),
  passwordHash: String (required),
  role: String (enum: ['freelancer', 'client'], default: 'freelancer'),
  clientId: ObjectId → Client (for client role users),
  timestamps: true
}
```

### 2. **Client Model** (Client Information)
```javascript
{
  userId: ObjectId → User (required, indexed),
  name: String (required),
  email: String,
  phone: String,
  address: String,
  defaultHourlyRate: Number (default: 0),
  timestamps: true
}
```

### 3. **Project Model** ⭐ UPDATED
```javascript
{
  userId: ObjectId → User (required, indexed),
  clientId: ObjectId → Client (required, indexed),
  name: String (required),
  description: String,
  deadline: Date,                    // ⭐ NEW FIELD
  hourlyRate: Number,
  status: String (enum: ['active', 'archived'], default: 'active'),
  timestamps: true
}
```

### 4. **Task Model**
```javascript
{
  userId: ObjectId → User (required, indexed),
  projectId: ObjectId → Project (required, indexed),
  title: String (required),
  description: String,
  status: String (enum: ['todo', 'in_progress', 'done'], default: 'todo'),
  timestamps: true
}
```

### 5. **WorkSession Model** (Time Tracking)
```javascript
{
  userId: ObjectId → User (required, indexed),
  projectId: ObjectId → Project (required, indexed),
  taskId: ObjectId → Task,
  startTime: Date (required),
  endTime: Date,
  durationMinutes: Number,
  note: String,
  hourlyRate: Number,
  invoiced: Boolean (default: false),
  invoiceId: ObjectId → Invoice,
  timestamps: true
}
```

### 6. **Invoice Model**
```javascript
{
  userId: ObjectId → User (required, indexed),
  clientId: ObjectId → Client (required, indexed),
  projectId: ObjectId → Project (required),
  number: String (required),
  issueDate: Date (default: now),
  dueDate: Date,
  currency: String (default: 'INR'),
  items: [
    {
      workSessionId: ObjectId,
      description: String,
      hours: Number (required),
      rate: Number (required),
      amount: Number (required)
    }
  ],
  subtotal: Number (required),
  taxPercent: Number (default: 0),
  taxAmount: Number (default: 0),
  total: Number (required),
  pdfPath: String,
  status: String (enum: ['draft', 'sent', 'paid', 'overdue'], default: 'draft'),
  notes: String,
  timestamps: true
}
```

---

## 🔄 Updated Workflow

### **Adding a New Client:**

**Frontend Form Fields:**
1. Client Name (required)
2. Email
3. Phone
4. Address
5. Hourly Rate
6. **Project Name** (required)
7. **Project Description** (required)
8. **Project Deadline** (required)

**Backend Process:**
1. Creates Client record
2. Automatically creates Project record with deadline
3. Links project to client
4. Ready to start time tracking!

---

## 🚀 Next Steps

1. **Restart your backend server** to ensure models are fresh:
   ```bash
   cd Server
   npm run dev
   ```

2. **Create your first user:**
   - Go to frontend
   - Register as freelancer
   - Start adding clients!

3. **Test the flow:**
   - Add a client with project details
   - Check that project is created with deadline
   - Verify all fields are saved correctly

---

## 📝 Notes

- ✅ All old data removed
- ✅ Schema updated with deadline field
- ✅ Projects page hidden from navigation
- ✅ Streamlined client onboarding
- ✅ All indexes preserved for performance
- ✅ Timestamps on all collections

**Database is now clean and ready for use!** 🎉
