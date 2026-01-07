# Firebase Setup Guide for Analyrics

This guide will help you set up Firebase and configure the necessary credentials for the analyrics project.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "Analyrics" or "analyrics-prod")
4. (Optional) Disable Google Analytics if you don't need it
5. Click **"Create project"** and wait for it to finish

## Step 2: Enable Firestore Database

1. In your Firebase project, click on **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll configure rules later)
4. Select a Firestore location (choose closest to your users, e.g., `asia-southeast1` for Vietnam)
5. Click **"Enable"**

## Step 3: Generate Service Account Credentials

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Go to the **"Service accounts"** tab
4. Click **"Generate new private key"**
5. Click **"Generate key"** in the confirmation dialog
6. A JSON file will be downloaded - **KEEP THIS FILE SECURE!**

## Step 4: Extract Credentials from JSON

Open the downloaded JSON file. You'll see something like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBg...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  ...
}
```

You need these three values:
- `project_id`
- `client_email`
- `private_key`

## Step 5: Add Credentials to .env.local

1. Open `/Users/Vu_Nguyen/Documents/projects/analyrics/.env.local`
2. Add the following lines (replace with your actual values):

```env
# Firebase Admin SDK Credentials
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBg...YOUR_FULL_PRIVATE_KEY_HERE...
-----END PRIVATE KEY-----"
```

**IMPORTANT NOTES:**
- The `FIREBASE_PRIVATE_KEY` should be wrapped in **double quotes**
- Keep the `\n` newline characters in the private key as-is
- Do NOT share these credentials or commit them to Git

## Step 6: Verify Setup

1. Save the `.env.local` file
2. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```
3. Check the terminal for: `✅ Firebase Admin initialized successfully`
4. Search for and analyze a song
5. Check for: `✅ Saved analysis to database for: [song name]`

## Step 7: Configure Firestore Security Rules (Optional but Recommended)

1. Go to Firebase Console → Firestore Database
2. Click on the **"Rules"** tab
3. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow server-side access (Admin SDK)
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. Click **"Publish"**

This ensures only your server (using Admin SDK) can access the database.

## Troubleshooting

### Error: "Firebase credentials missing"
- Check that all three environment variables are set in `.env.local`
- Restart the dev server after adding credentials

### Error: "Private key failed to parse"
- Make sure the private key is wrapped in quotes
- Keep the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` headers
- Don't remove the `\n` characters

### Error: "Permission denied"
- Your service account credentials might be invalid
- Try generating a new service account key

### Database not saving
- Check Firebase Console → Firestore Database to see if the `analyzedSongs` collection appears
- Check terminal logs for detailed error messages

## Security Notes

⚠️ **NEVER commit `.env.local` to Git!**
- The `.gitignore` file should already exclude it
- If you accidentally commit it, immediately:
  1. Delete the service account in Firebase Console
  2. Generate new credentials
  3. Update `.env.local` with new credentials

## What's Next?

Once configured, the app will:
- ✅ Check Firebase database for previously analyzed songs
- ✅ Return cached results instantly (< 1 second)
- ✅ Only call Gemini AI for new songs
- ✅ Automatically save new analyses to Firebase

This saves AI credits and makes the app much faster for repeat searches!
