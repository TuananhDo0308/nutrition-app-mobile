# Smart Nutrition Management Application - Frontend

## Introduction

This is the **frontend** of the **Smart Nutrition Management Application Based on Image Recognition**, a student research project at **Ho Chi Minh City University of Education**. The application enables users to track their nutrition by capturing photos of meals, recognizing food items, estimating nutritional values (calories, protein, carbohydrates, fats), and managing daily meal plans. The frontend is developed using **React Native**, supporting both **Android** and **iOS** with a single codebase, ensuring a user-friendly interface and smooth performance.

### Objectives
- Provide an intuitive interface for capturing food images and displaying nutritional information.
- Support management of user profiles, nutrition history, and weight tracking.
- Synchronize data with the backend via **ASP.NET Core Web API** and integrate with an image recognition API.

### Target Users
- Individuals interested in health, those on diets, athletes, or patients with chronic conditions (diabetes, obesity).
- Users with mobile devices equipped with cameras and internet connectivity.

## Technologies Used
- **React Native**: Core framework for cross-platform mobile app development.
- **TypeScript**: Ensures type safety and maintainability.
- **Redux**: Manages global state (user data, nutrition plans).
- **Axios**: Handles HTTP requests to the backend API.
- **React Navigation**: Manages navigation between screens.
- **React Native Image Picker**: Enables capturing or selecting food images.
- **React Native Elements / NativeBase**: UI libraries for the interface.
- **react-native-chart-kit**: Displays nutrition and weight tracking charts.
- **Development Tools**: Visual Studio Code, Android Studio, Xcode.
- **Dependency Management**: npm.

### Folder Descriptions
- **/assets**: Stores logo images, icons, and custom fonts.
- **/components**: Contains reusable components like `Button`, `FoodCard`, `NutritionChart`.
- **/screens**: Includes screens such as `LoginScreen`, `ProfileScreen`, `ImageRecognitionScreen`, `NutritionPlanScreen`, `HistoryScreen`, `WeightTrackingScreen`.
- **/navigation**: Defines navigation, e.g., `MainStackNavigator` for the main flow and `TabNavigator` for the bottom menu.
- **/services**: Houses API call functions, e.g., `uploadFoodImage`, `fetchNutritionData`, `updateUserProfile`.
- **/store**: Configures Redux with slices like `userSlice`, `nutritionSlice`.
- **/utils**: Utility functions, e.g., `formatDate`, `calculateBMI`.
- **/constants**: Fixed values like `API_BASE_URL`, `COLORS`, `FONT_SIZES`.

## System Requirements
- **Node.js**: v16.x or higher.
- **npm**: v8.x or higher.
- **Android Studio**: For running Android emulator.
- **Xcode**: For running iOS simulator (macOS).
- **Mobile Device**: Android 5.0+ or iOS 12.0+ (with camera).
- **Internet Connection**: For API calls to backend and USDA.

## Setup and Running Instructions

### 1. Install Environment
1. Install **Node.js** and **npm**:
   ```bash
   node --version
   npm --version
   ```
2. Install **React Native CLI**:
   ```bash
   npm install -g react-native-cli
   ```
3. Install **Android Studio** and configure SDK (API Level 30 or higher).
4. Install **Xcode** (if on macOS) and configure iOS Simulator.
5. Ensure internet connectivity for downloading dependencies and API calls.

### 2. Clone the Repository
```bash
git clone https://github.com/your-repo/nutrition-app-frontend.git
cd nutrition-app-frontend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
- Create a `.env` file in the root directory:
  ```plaintext
  API_BASE_URL=http://your-backend-url/api
  USDA_API_KEY=your-usda-api-key
  ```
- Update `API_BASE_URL` with the backend URL (e.g., `http://localhost:5000/api`).
- Obtain `USDA_API_KEY` from [USDA FoodData Central](https://fdc.nal.usda.gov/).

### 5. Run the Application
- **On Android**:
  ```bash
  npx react-native run-android
  ```
- **On iOS**:
  ```bash
  npx react-native run-ios
  ```
- Ensure an emulator/simulator or physical device is connected.

### 6. Testing
- Use **Android Emulator** (Android Studio) or **iOS Simulator** (Xcode).
- Test on a physical device by enabling USB debugging and connecting via USB.
- View logs with:
  ```bash
  npx react-native log-android
  npx react-native log-ios
  ```

## Main Features
1. **Login/Signup**: User authentication via email/password, using JWT.
2. **Profile Management**: Update personal info (height, weight, BMI, TDEE).
3. **Image Recognition**: Capture/upload food images, display food names, ingredients, and nutrition.
4. **Nutrition Planning**: Add meals (breakfast, lunch, dinner), set calorie goals.
5. **History Tracking**: View nutrition reports by day/week/month via charts.
6. **Weight Tracking**: Log weight, view progress charts against goals.

## Usage Instructions
1. **Login/Signup**: Enter email and password to access the system.
2. **Update Profile**: Go to “Profile” to add height, weight, and goals.
3. **Capture Food Images**: Navigate to “Recognition,” capture/upload photos, view nutrition results.
4. **Plan Nutrition**: Select a date, add meals to breakfast/lunch/dinner, view total calories.
5. **Track Progress**: Check nutrition history or weight charts in “History.”

## Video Demo
A demonstration video showcasing the application's key features is available. The video covers:
- User login and profile setup.
- Capturing and analyzing food images for nutritional information.
- Creating and managing daily nutrition plans.
- Viewing nutrition history and weight tracking charts.

Watch the demo here: [Link to Video Demo](https://youtu.be/H5-OwkxSjV8)  
*Note*: Replace the placeholder link with the actual URL (e.g., YouTube, Google Drive, or portfolio link) where the demo video is hosted.

## Limitations and Improvements
### Limitations
- Performance may lag compared to fully native apps for heavy tasks (e.g., complex charts).
- Some native features (advanced image processing) require platform-specific code.
- Dependency on image quality and external image recognition API.

### Future Improvements
- Add push notifications for meal reminders or smart menu suggestions.
- Implement offline functionality by caching data locally.
- Optimize performance with lazy loading and caching for long lists.

## License
This project is developed for research purposes at **Ho Chi Minh City University of Education**. Contact the authors before using for commercial purposes.

## Contact
- **Development Team**: Lê Hồng Anh, Đỗ Trần Tuấn Anh, Trần Quốc Ấn, Nguyễn Minh Thành, Nguyễn Thanh Bình.
- **Supervisor**: M.S. Trần Thanh Nhã.
- **Email**: TuananhDo0308@gmail.com.

---

*Ho Chi Minh City, April 2025*