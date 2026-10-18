# DoList — Full-Stack Todo Application

A responsive dark-themed task manager built with HTML, CSS, vanilla JavaScript, Node.js, Express, MongoDB/Mongoose, and MSG91 OTP authentication.

## Features

- Mobile OTP sign-in/registration using MSG91 (same flow for new and returning users)
- Private, user-specific tasks
- Add, edit, complete, and delete tasks
- Categories: Personal, Work, Study, Shopping, Other
- Due dates, overdue labels, created/updated timestamps, and recent task activity
- Summary cards and completion progress ring
- Responsive UI, dark theme, subtle animations
- HTTP-only JWT cookie; OTP endpoints have basic rate limits

## Requirements

- Node.js 20 or newer (includes `fetch`)
- MongoDB local installation OR a MongoDB Atlas cluster
- MSG91 account with OTP service enabled, an OTP template ID, and an auth key

## Setup on Windows (VS Code)

1. Extract the ZIP.
2. Open the extracted `DoList-Full-Stack` folder in VS Code.
3. Open Terminal → New Terminal. Confirm terminal is in the project folder (the folder containing `package.json`).
4. Install dependencies:

   ```powershell
   npm install
   ```

5. Create your local environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

6. Open `.env` and fill in:
   - `MONGODB_URI`: local MongoDB URI or your Atlas connection string
   - `JWT_SECRET`: a long random secret (at least 32 characters)
   - `MSG91_AUTH_KEY`: your private MSG91 auth key
   - `MSG91_OTP_TEMPLATE_ID`: your MSG91 OTP template ID

   Do not share `.env`, publish it to GitHub, or paste your MSG91 auth key into frontend code. MSG91 credentials belong only on the server.

7. Start the app:

   ```powershell
   npm run dev
   ```

8. Open **http://localhost:3000**.

Keep the terminal running while using the website.

## MongoDB

### Local MongoDB
Install and start MongoDB Community Server, then use:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/dolist
```

A VS Code MongoDB extension does not install/start the database server.

### MongoDB Atlas
Create a cluster and database user, allow your current IP in Network Access, and copy the Node.js connection string into `.env`. Replace the password placeholder and URL-encode special characters in the password.

## MSG91 setup

1. Sign in to MSG91 and enable/configure OTP.
2. Create or select an OTP template and copy its template ID.
3. Copy the account auth key into `.env`.
4. The backend calls the MSG91 SendOTP endpoint and Verify OTP endpoint. The current SendOTP API reference is:
   https://docs.msg91.com/otp/sendotp
5. Make sure your MSG91 account, sender/template configuration, DLT requirements, and available credits are ready. Real SMS delivery depends on the account and regional setup.

## Useful commands

```powershell
npm run dev
npm start
```

Health check: http://localhost:3000/api/health

## Troubleshooting

- **MongoDB connection error:** make sure MongoDB is running and `MONGODB_URI` is correct.
- **MSG91 is not configured:** replace the example values in `.env` with real MSG91 credentials.
- **OTP SMS is not delivered:** check MSG91 logs, template configuration, account balance, DLT/sender setup, and mobile number format.
- **Port 3000 is busy:** change `PORT=3001` in `.env` and open http://localhost:3001.
- **Session/auth problems:** make sure cookies are enabled and use the same localhost hostname throughout.

## Notes

- The application intentionally does not display a fake OTP in the browser. Real verification requires a configured MSG91 account.
- Before public production deployment, configure HTTPS, a strong secret, production database access controls, monitoring, and appropriate abuse protection. Consider adding a persistent rate-limit store and CSRF protection for a larger production service.
- Task history currently shows the latest task creation/update/completion state based on task timestamps. It is not a separate immutable audit log.
