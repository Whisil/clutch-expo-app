# Clutch Test - Expo Application

# This is an iOS focused app

## 🚀 Initial Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   You must set up your environment variables to connect to Supabase. Create a `.env` file in the root of the project (use the `.env.example`, it has the keys in there)

## 📱 Launching on iOS

To run the application locally on an iOS Simulator:

1. Ensure Xcode and the iOS Simulator are installed and up to date on your Mac.
2. In your terminal, run the following command:
   ```bash
   npm run ios
   ```
   *This command leverages `expo start --ios`, which will automatically start the Metro bundler and boot up the iOS simulator.*

To run the application on a **physical iOS device**:
1. Run `npm start`.
2. Open the **Camera** app on your iPhone and scan the QR code that appears in your terminal.
3. Open the link natively in the **Expo Go** application.

## 🧪 Testing the App

Currently, the application is tested via manual verification flows.

### End-to-End Manual Testing Flow
1. **Authentication:**
   - Launch the app. Ensure you are greeted by the Sign In / Sign Up screen.
   - Register a new dummy account.
2. **Video Feed & Social Features:**
   - Once logged in, navigate to the Home feed.
   - Verify that the highlights stream plays correctly, loaded infinitely, able to be viewed in fullscreen with rotations.
   - **Likes:** Tap the heart icon; it should turn red instantly and the total like counter should increment. Tap again to unlike.
   - **Comments:** Tap the comment icon; the bottom sheet modal should slide up. Enter a comment over 1 character and under 500 characters to verify validation, then post it to ensure it renders with your avatar and name.
3. **Profile Management:**
   - Navigate to the Profile tab.
   - Update your display name, upload a new avatar via the image picker, and hit Save.
   - Sign out, then sign back in to verify the session persistence resolves correctly.
