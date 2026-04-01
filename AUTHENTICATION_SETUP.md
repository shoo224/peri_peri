# Peri Peri Bites - User Authentication Setup Guide

## � Database Structure
### Database: `peri_peri_bites`

All collections are now created inside the `peri_peri_bites` database instead of the default `test` database.
### Two Separate Collections:

1. **TestUser Collection** - For development/testing only
   - Created via `seedDatabase.js`
   - Pre-filled with test credentials
   - Use these to test login functionality without registering

2. **RegisteredUser Collection** - For real user registrations
   - Contains users who sign up via the registration form
   - This is where actual user data is stored
   - These collections are completely separate

## 🚀 Quick Start

### 1. Seed Test Credentials to Database

Run the seed script to add test users to the **TestUser** collection:

```bash
cd user_auth
node seedDatabase.js
```

**Expected Output:**
```
✓ Connected to MongoDB
✓ Created test user: test@example.com
✓ Created test user: admin@example.com
✓ Created test user: john@example.com

✓ Database seeding completed successfully!

💾 These test users are stored in 'TestUser' collection
   Registered users from the app will be in 'RegisteredUser' collection
```

### 2. Start Backend Server

```bash
cd user_auth
npm start
```

The server will run on `http://localhost:5000`

### 3. Start Frontend Development Server

In a new terminal:

```bash
cd frontend/peri\ peri\ bites
npm run dev
```

The frontend will run on `http://localhost:5173` (or similar)

## 🔐 Authentication Features

### Login Priority
When a user logs in, the system checks in this order:
1. **RegisteredUser collection** (real users who signed up) - Priority
2. **TestUser collection** (test credentials for development)

This means anyone can log in with either test or registered credentials, but registered users take priority.

### Login Flow
1. User enters email and password on the login page
2. Credentials are validated against both collections (RegisteredUser first, then TestUser)
3. On successful login:
   - User data is stored in localStorage
   - User icon (👤) with name appears in the top-left navbar
   - User is redirected to homepage
4. On failed login:
   - Error message displays: "Invalid credentials. Please check your email and password."
   - Option to register is provided

### Registration Flow
1. New user fills in name, email, password, and role
2. Password is hashed using bcryptjs
3. User data is stored in **RegisteredUser collection** (MongoDB)
4. User is redirected to login page
5. Registered users can now login with their credentials

### User Profile Dropdown
- Click on the user icon in the navbar to open the dropdown menu
- View user name and email
- Click "Logout" to clear session and return to homepage
- Login button reappears in navbar after logout

## 📝 Test Credentials

These test credentials are stored in the **TestUser** collection:

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| test@example.com | password123 | Customer | Standard customer testing |
| admin@example.com | admin123 | Admin | Admin role testing |
| john@example.com | john123 | Customer | Alternative user testing |

**Note:** These are for testing only and are seeded via script. They don't mix with registered users.

## 🗄️ Database Collections

### RegisteredUser Collection
Stores users who register through the app:
- `_id` (ObjectId) - Unique identifier
- `name` (String) - User's full name
- `email` (String) - User's email (unique, lowercase)
- `password` (String) - Hashed password using bcryptjs
- `role` (String) - User role: Admin, Emp, or Customer (default: Customer)
- `createdAt` (Timestamp) - Account creation time
- `updatedAt` (Timestamp) - Last update time

### TestUser Collection
Stores pre-seeded test credentials:
- Same schema as RegisteredUser
- Only created by running `seedDatabase.js`
- Separate from actual user registrations

## 🔧 Backend API Endpoints

### Register User (Stores in RegisteredUser collection)
- **URL:** `POST /api/auth/register`
- **Body:** 
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123",
    "role": "Customer"
  }
  ```
- **Success Response:** `201`
  ```json
  {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "message": "User registered successfully"
  }
  ```

### Login User (Checks RegisteredUser first, then TestUser)
- **URL:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response:** `200`
  ```json
  {
    "message": "Login success",
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
  ```
- **Error Response:** `401`
  ```json
  {
    "message": "Invalid credentials. Please check your email and password."
  }
  ```

## 🗄️ Database Configuration

### MongoDB Connection String
The application now connects to the `peri_peri_bites` database:

```env
MONGO_URI = mongodb+srv://ranjanshushant173_db_user:shu59173@cluster0.jkshnhl.mongodb.net/peri_peri_bites?appName=Cluster0
```

**Database Name:** `peri_peri_bites`
- All collections (TestUser, RegisteredUser) are created inside this database
- Previously used default `test` database
- Updated in `.env` file

## 📱 Frontend Features

### Components Updated
1. **Navbar.jsx** - Shows user profile when logged in
2. **LoginForm.jsx** - Login form with validation
3. **RegisterForm.jsx** - Registration form
4. **HomePage.jsx** - Main landing page

### LocalStorage
- User data is stored in `localStorage` with key `user`
- User icon appears conditionally based on localStorage data
- Logout clears the localStorage

## 🔄 File Changes

### New Files:
- `seedDatabase.js` - Script to seed TestUser collection
- `models/TestUser.js` - Schema for test users

### Modified Files:
- `models/User.js` → Now called "RegisteredUser" collection
- `controller/authController.js` → Uses both collections, priority to RegisteredUser
- `AUTHENTICATION_SETUP.md` → This file

## 🐛 Troubleshooting

### "Invalid credentials. Please register if you don't have an account."
- The user doesn't exist in either collection
- Try registering a new account first
- Or use one of the test credentials above

### "Invalid credentials. Please check your email and password."
- Email exists but password is wrong
- Check the password carefully (case-sensitive)

### User icon not appearing after login
- Check if browser's localStorage is enabled
- Open Developer Tools → Application → LocalStorage
- Verify `user` key is present with correct data
- Refresh the page if needed

### MongoDB Connection Error
- Verify `.env` file in `user_auth` folder has correct credentials
- Check MongoDB Atlas network access settings
- Ensure NODE_TLS_REJECT_UNAUTHORIZED=0 (for development only)

### Data Going to Wrong Collection
- Registered users signing up → Go to **RegisteredUser** collection ✓
- Test users from seed script → Go to **TestUser** collection ✓
- Check MongoDB Atlas to verify collections exist and contain correct data

## ✅ What's Working

✓ Separate TestUser collection for development
✓ Separate RegisteredUser collection for real signups
✓ No mixing of test and production user data
✓ Users can login with test or registered credentials
✓ User icon appears in navbar when logged in
✓ User can logout using the dropdown menu
✓ New users register and their data goes to RegisteredUser
✓ Error messages guide users to register if needed
✓ Responsive design for mobile and desktop

## 🔜 Next Steps

- Implement JWT token generation and verification
- Create protected routes for authenticated users only
- Build product catalog and shopping cart
- Add order management features
- Implement payment integration
- Add profile management page
- Implement role-based access control

