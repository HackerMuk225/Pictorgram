# Firebase Setup Guide for Pictorgram

## Overview
Pictorgram has been migrated from localStorage to Firebase for cloud-based authentication and data storage. This allows users to access their accounts from any device.

## Steps to Set Up Firebase

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `Pictorgram` (or your preferred name)
4. Accept the terms and click **Create project**
5. Wait for the project to be created

### 2. Enable Firebase Authentication
1. In the Firebase console, go to **Authentication** (left sidebar)
2. Click **Get started**
3. Select **Email/Password** as the sign-in method
4. Enable it and click **Save**

### 3. Create Firestore Database
1. Go to **Firestore Database** (left sidebar)
2. Click **Create database**
3. Select **Start in production mode**
4. Choose your location and click **Enable**
5. Once created, go to **Rules** tab and update with this security rule:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth.uid == userId;
      allow delete: if request.auth.uid == userId;
    }
  }
}
```

### 4. Get Your Firebase Config
1. In Firebase console, click the **Settings icon** (⚙️) → **Project settings**
2. Scroll down to **Your apps** section
3. Click **Web** icon (or add web app if not present)
4. Copy the Firebase configuration object

### 5. Update database.js
Replace the `firebaseConfig` object in `database.js` with your copied configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};
```

## Features Now Available

✅ **Cloud-Based Authentication**: Users authenticate with Firebase Auth  
✅ **Cross-Device Access**: Users can log in from any device  
✅ **Secure Data Storage**: User profiles stored in Firestore  
✅ **Password Reset**: Email-based password reset functionality  
✅ **User Discovery**: Users can view and browse other user profiles  
✅ **Profile Customization**: Users can upload profile pictures and edit display names  

## Security Notes

- Passwords are securely managed by Firebase Authentication
- User data is stored encrypted in Firestore
- Database rules ensure users can only modify their own profiles
- All credentials are stored in the cloud, not locally

## Troubleshooting

### "Firebase is not defined"
- Ensure Firebase scripts are loaded in all HTML files before script.js

### "CORS errors"
- Firebase should work across domains. Check your domain is whitelisted in Firebase console → Authentication → Settings

### "Permission denied" errors
- Verify Firestore rules are correctly updated
- Ensure user is authenticated before accessing data

## Testing

1. Open `index.html` in a browser
2. Create a new account
3. Log in with the account
4. Try logging in from a different browser/device
5. Verify you can access the same account with the same credentials
