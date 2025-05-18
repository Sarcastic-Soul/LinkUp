# LinkUp - Chat App

This guide provides step-by-step instructions to set up and run the LinkUp built using Expo. The app allows users to communicate in real-time, with features like image uploads powered by Cloudinary and authentication/database handled by Firebase. Follow the steps below to get started.

---

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Expo CLI (install globally using `npm install -g expo-cli`)
- Android Emulator (optional) or the Expo Go app for running on a physical device

---

## Steps to Run the App

### 1. Install Dependencies

Run the following command in the root directory of the project to install all required dependencies:

```bash
npm install
```

---

### 2. Configure Cloudinary

To enable image uploads and other Cloudinary functionalities, you need to add your Cloudinary credentials.

1. Navigate to the `/utils/cloudinary.js` file.
2. Replace the placeholders with your Cloudinary credentials:

```javascript
export const cloudId = ''; 
export const cloudName = ''; 
export const uploadPreset = ''; 
export const apiKey = ''; 
export const apiSecret = ''; 
```

---

### 3. Set Up Firebase

To enable Firebase functionalities (e.g., authentication, database), you need to configure Firebase.

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Add your Firebase configuration to the `firebaseConfig.js` file:

```javascript

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};
```

Replace the placeholders with your Firebase project's credentials.

---

### 4. Start the Application

Once all configurations are in place, start the application by running:

```bash
npm start
```

This will start the Expo development server and open a new tab in your browser with the Expo Dev Tools.

---

### 5. Run the App on an Emulator or Physical Device

#### Option 1: Android Emulator
- Ensure your Android Emulator is running.
- In the Expo Dev Tools, click on **Run on Android device/emulator**.

#### Option 2: Physical Device
- Download the **Expo Go** app from the App Store (iOS) or Google Play Store (Android).
- Scan the QR code displayed in the Expo Dev Tools using the Expo Go app.

---

## Troubleshooting

- **Firebase Errors**: Ensure your Firebase configuration is correct and the required services (e.g., Authentication, Firestore) are enabled in the Firebase Console.
- **Cloudinary Errors**: Verify that your Cloudinary credentials are correct and the upload preset is configured properly.
- **Expo Issues**: If the app doesn't load, try clearing the cache with `expo start -c` or reinstalling dependencies.

---

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

Enjoy using the app! If you encounter any issues, feel free to reach out for support.
